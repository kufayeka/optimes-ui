/**
 * @typedef {Object} ScheduleEntity
 * @property {string} id
 * @property {string} schedule_category
 * @property {string} target_entity 
 * @property {'planned'|'loaded'|'unloaded'|'suspended'} schedule_status
 * @property {string} planned_start_time
 * @property {string} planned_finish_time
 * @property {Object} schedule_data
 * @property {string} schedule_data.shift
 * @property {string} schedule_data.routing
 * @property {string} schedule_data.material
 * @property {string} schedule_data.quantity_unit
 * @property {number} schedule_data.quantity_order
 * @property {string} schedule_data.work_order_number
 * @property {string} schedule_data.sales_order_number
 */

/**
 * @typedef {Object} GanttChartOptions
 * @property {number} [dayWidth] - Lebar satu hari dalam piksel. Default: 40
 * @property {number} [rowHeight] - Tinggi baris task dalam piksel. Default: 30
 * @property {number} [topHeaderHeight] - Tinggi header atas dalam piksel. Default: 40
 * @property {number} [categoryLabelWidth] - Lebar kolom label kategori. Default: 120
 * @property {number} [selectedMonth] - Bulan yang ditampilkan (1-12). Default: bulan sekarang.
 * @property {number} [selectedYear] - Tahun yang ditampilkan. Default: tahun sekarang.
 * @property {boolean} [useTimeOffset] - Menggunakan offset waktu (jam/menit) untuk perhitungan. Default: true
 * @property {boolean} [alwaysRenderTaskOnANewRow] - Setiap task selalu di baris baru. Default: true
 */

/**
 * GanttChart adalah class untuk merender chart schedule berbasis SVG.
 * Stateless: data dan options selalu dikirim lewat method render.
 */
class GanttChart {
    /**
     * @param {SVGElement} svgElement - Elemen SVG tempat chart akan dirender.
     */
    constructor(svgElement) {
        this.svg = svgElement;
        this.onTaskClick = function (task) {
            console.log('Task clicked:', task);
        };
        // Warna dasar
        this.categoryBgColor = {
            production: '#00CC00',
            maintenance: '#e5e322',
            other: '#B3B3B3'
        };
        this.taskColor = {
            production: '#00CC00',
            maintenance: '#e5e322',
            other: '#B3B3B3'
        };
        this.taskStatusColour = {
            loaded: '#00CC00',
            suspended: '#757575',
            planned: '#004ecd',
            unloaded: '#ff0d0d'
        };
    }

    /**
     * Render ulang keseluruhan chart.
     * @param {ScheduleEntity[]} tasks
     * @param {GanttChartOptions} [options]
     */
    render(tasks, options = {}) {
        // Default options
        const opts = Object.assign(
            {
                dayWidth: 40,
                rowHeight: 30,
                topHeaderHeight: 40,
                categoryLabelWidth: 120,
                selectedMonth: new Date().getMonth() + 1,
                selectedYear: new Date().getFullYear(),
                useTimeOffset: true,
                alwaysRenderTaskOnANewRow: true
            },
            options
        );

        // Bersihkan SVG
        while (this.svg.firstChild) {
            this.svg.removeChild(this.svg.firstChild);
        }

        // Preprocess tasks
        const mappedTasks = (tasks || []).map(task => ({
            ...task,
            target_entity: task.target_entity || "entity",
            schedule_name: task.schedule_name ||
                (task.schedule_data?.work_order_number
                    ? `${task.schedule_data.work_order_number}`
                    : "schedule"),
        }));

        // Kelompokkan dan hitung baris
        const catData = this.computeRowUsage(mappedTasks, opts);

        let totalRows = 0;
        catData.forEach(cat => {
            totalRows += Math.max(1, cat.totalRows);
        });
        const daysInMonth = new Date(
            opts.selectedYear,
            opts.selectedMonth,
            0
        ).getDate();
        const totalChartWidth =
            opts.categoryLabelWidth + daysInMonth * opts.dayWidth;
        this.svg.setAttribute('width', totalChartWidth.toString());

        this.renderDayHeader(daysInMonth, totalChartWidth, opts);
        this.renderDayColumns(daysInMonth, totalRows, totalChartWidth, opts);
        this.renderCategoryOverlays(catData, daysInMonth, opts);
        this.renderHorizontalLines(totalRows, totalChartWidth, opts);
        this.renderCategoriesAndTasks(catData, daysInMonth, totalChartWidth, opts);

        const totalSvgHeight =
            opts.topHeaderHeight + totalRows * opts.rowHeight;
        this.svg.setAttribute('height', totalSvgHeight.toString());
    }

    /**
     * Bersihkan SVG.
     */
    destroy() {
        while (this.svg.firstChild) {
            this.svg.removeChild(this.svg.firstChild);
        }
    }

    /**
     * Kelompokkan task berdasarkan kategori dan hitung baris yang diperlukan.
     */
    computeRowUsage(tasks, opts) {
        const categories = ['production', 'maintenance', 'other'];
        const startOfChart = new Date(
            opts.selectedYear,
            opts.selectedMonth - 1,
            1,
            0,
            0,
            0
        );
        const endOfChart = new Date(
            opts.selectedYear,
            opts.selectedMonth,
            0,
            23,
            59,
            59
        );
        const result = [];
        categories.forEach(category => {
            const tasksInCategory = tasks.filter(
                t => t.schedule_category === category
            );
            const rowUsage = [];
            const mappedTasks = [];
            tasksInCategory.forEach(task => {
                const { adjustedStart, adjustedEnd } = this.adjustTaskDates(
                    task,
                    startOfChart,
                    endOfChart
                );
                const { startFraction, endFraction } = this.computeFraction(
                    adjustedStart,
                    adjustedEnd,
                    opts
                );
                const startXPos = startFraction * opts.dayWidth;
                const width = (endFraction - startFraction) * opts.dayWidth;
                let row = 0;
                if (opts.alwaysRenderTaskOnANewRow) {
                    row = rowUsage.length;
                } else {
                    while (rowUsage[row] && rowUsage[row] > startXPos) {
                        row++;
                    }
                }
                rowUsage[row] = startXPos + width;
                mappedTasks.push({ task: task, x: startXPos, width: width, rowIndex: row });
            });
            const totalRows = rowUsage.length;
            result.push({ category: category, tasks: mappedTasks, totalRows: totalRows });
        });
        return result;
    }

    /**
     * Sesuaikan tanggal task dengan batas chart.
     */
    adjustTaskDates(task, startOfChart, endOfChart) {
        const origStart = new Date(task.planned_start_time);
        const origEnd = new Date(task.planned_finish_time);
        let adjustedStart = origStart < startOfChart ? new Date(startOfChart) : origStart;
        let adjustedEnd = origEnd > endOfChart ? new Date(endOfChart) : origEnd;
        return { adjustedStart, adjustedEnd };
    }

    /**
     * Hitung fraction posisi berdasarkan tanggal.
     */
    computeFraction(adjustedStart, adjustedEnd, opts) {
        const sDay = adjustedStart.getDate();
        const sHour = adjustedStart.getHours();
        const sMin = adjustedStart.getMinutes();
        const eDay = adjustedEnd.getDate();
        const eHour = adjustedEnd.getHours();
        const eMin = adjustedEnd.getMinutes();
        let startFraction, endFraction;
        if (opts.useTimeOffset) {
            startFraction = (sDay - 1) + ((sHour + sMin / 60) / 24);
            endFraction = (eDay - 1) + ((eHour + eMin / 60) / 24);
        } else {
            startFraction = sDay - 1;
            endFraction = eDay;
        }
        return { startFraction, endFraction };
    }

    /**
     * Render header hari.
     */
    renderDayHeader(daysInMonth, totalChartWidth, opts) {
        const headerRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        headerRect.setAttribute('x', '0');
        headerRect.setAttribute('y', '0');
        headerRect.setAttribute('width', totalChartWidth.toString());
        headerRect.setAttribute('height', opts.topHeaderHeight.toString());
        headerRect.setAttribute('fill', '#EEEEEE');
        headerRect.setAttribute('stroke', '#CCC');
        this.svg.appendChild(headerRect);

        for (let i = 0; i < daysInMonth; i++) {
            const dayNum = i + 1;
            const xPos = opts.categoryLabelWidth + i * opts.dayWidth;
            const dayBox = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            dayBox.setAttribute('x', xPos.toString());
            dayBox.setAttribute('y', '0');
            dayBox.setAttribute('width', opts.dayWidth.toString());
            dayBox.setAttribute('height', opts.topHeaderHeight.toString());
            dayBox.setAttribute('fill', dayNum % 2 === 0 ? '#fff' : '#f8f8f8');
            dayBox.setAttribute('stroke', '#ccc');
            dayBox.setAttribute('rx', '5');
            this.svg.appendChild(dayBox);
            const dayText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            dayText.setAttribute('x', (xPos + opts.dayWidth / 2).toString());
            dayText.setAttribute('y', (opts.topHeaderHeight / 1.6).toString());
            dayText.setAttribute('fill', '#000');
            dayText.setAttribute('font-size', '15');
            dayText.setAttribute('font-weight', 'bold');
            dayText.setAttribute('text-anchor', 'middle');
            dayText.textContent = String(dayNum);
            this.svg.appendChild(dayText);
        }
    }

    /**
     * Render kolom hari di grid.
     */
    renderDayColumns(daysInMonth, totalRows, totalChartWidth, opts) {
        const gridTopY = opts.topHeaderHeight;
        const gridHeight = totalRows * opts.rowHeight;
        for (let i = 0; i < daysInMonth; i++) {
            const dayNum = i + 1;
            const xPos = opts.categoryLabelWidth + i * opts.dayWidth;
            const colRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            colRect.setAttribute('x', xPos.toString());
            colRect.setAttribute('y', gridTopY.toString());
            colRect.setAttribute('width', opts.dayWidth.toString());
            colRect.setAttribute('height', gridHeight.toString());
            colRect.setAttribute('rx', '5');
            colRect.setAttribute('ry', '5');
            colRect.setAttribute('fill', dayNum % 2 !== 0 ? 'white' : 'white');
            colRect.setAttribute('stroke', 'black');
            colRect.setAttribute('stroke-width', '1');
            this.svg.appendChild(colRect);
        }
    }

    /**
     * Render garis horizontal grid.
     */
    renderHorizontalLines(totalRows, totalChartWidth, opts) {
        const gridTopY = opts.topHeaderHeight;
        for (let r = 0; r <= totalRows; r++) {
            const yPos = gridTopY + r * opts.rowHeight;
            const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            hLine.setAttribute('x1', '0');
            hLine.setAttribute('y1', yPos.toString());
            hLine.setAttribute('x2', totalChartWidth.toString());
            hLine.setAttribute('y2', yPos.toString());
            hLine.setAttribute('stroke', '#ccc');
            hLine.setAttribute('stroke-width', '1');
            this.svg.appendChild(hLine);
        }
    }

    /**
     * Render overlay tipis di belakang area grid untuk kategori production & maintenance
     */
    renderCategoryOverlays(catData, daysInMonth, opts) {
        const overlayX = opts.categoryLabelWidth;
        const overlayWidth = daysInMonth * opts.dayWidth;
        let rowOffset = 0;

        catData.forEach(cat => {
            const rows = Math.max(1, cat.totalRows);
            const overlayY = opts.topHeaderHeight + rowOffset * opts.rowHeight;
            const overlayHeight = rows * opts.rowHeight;

            if (cat.category === 'production' || cat.category === 'maintenance') {
                const overlayRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                overlayRect.setAttribute('x', overlayX);
                overlayRect.setAttribute('y', overlayY);
                overlayRect.setAttribute('width', overlayWidth);
                overlayRect.setAttribute('height', overlayHeight);
                overlayRect.setAttribute('fill', this.categoryBgColor[cat.category]);
                overlayRect.setAttribute('opacity', '0.1');
                this.svg.appendChild(overlayRect);
            }

            rowOffset += rows;
        });
    }

    /**
     * Render kategori dan task di dalam chart.
     */
    renderCategoriesAndTasks(catData, daysInMonth, totalChartWidth, opts) {
        let currentRowOffset = 0;
        catData.forEach(cat => {
            const catRows = Math.max(1, cat.totalRows);
            const categoryHeight = catRows * opts.rowHeight;
            const categoryTopY = opts.topHeaderHeight + currentRowOffset * opts.rowHeight;

            // Bounding box kategori
            const catBox = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            catBox.setAttribute('x', '0');
            catBox.setAttribute('y', categoryTopY.toString());
            catBox.setAttribute('width', opts.categoryLabelWidth.toString());
            catBox.setAttribute('height', categoryHeight.toString());
            catBox.setAttribute('fill', this.categoryBgColor[cat.category]);
            catBox.setAttribute('stroke', '#999');
            catBox.setAttribute('rx', '5');
            catBox.setAttribute('stroke-width', '1');
            this.svg.appendChild(catBox);

            const catBGBox = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            catBGBox.setAttribute('x', '120');
            catBGBox.setAttribute('y', categoryTopY.toString());
            catBGBox.setAttribute('width', totalChartWidth);
            catBGBox.setAttribute('height', categoryHeight.toString());
            catBGBox.setAttribute('fill', this.categoryBgColor[cat.category]);
            catBGBox.setAttribute('stroke', '#999');
            catBGBox.setAttribute('opacity', '0.7');
            catBGBox.setAttribute('rx', '5');
            catBGBox.setAttribute('stroke-width', '1');
            this.svg.appendChild(catBGBox);

            // Divider line
            const yPos = categoryTopY + categoryHeight;
            const dividerLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            dividerLine.setAttribute('x1', '0');
            dividerLine.setAttribute('y1', yPos.toString());
            dividerLine.setAttribute('x2', totalChartWidth.toString());
            dividerLine.setAttribute('y2', yPos.toString());
            dividerLine.setAttribute('stroke', 'red');
            dividerLine.setAttribute('stroke-width', '1');
            this.svg.appendChild(dividerLine);

            // Label kategori
            const labelX = 10;
            const labelY = categoryTopY + (categoryHeight / 2);
            const catLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            catLabel.setAttribute('x', labelX.toString());
            catLabel.setAttribute('y', labelY.toString());
            catLabel.setAttribute('fill', 'black');
            catLabel.setAttribute('font-size', '17');
            catLabel.setAttribute('font-weight', 'bold');
            catLabel.setAttribute('dominant-baseline', 'middle');
            catLabel.textContent = cat.category.charAt(0).toUpperCase() + cat.category.slice(1);
            this.svg.appendChild(catLabel);

            // Render task untuk tiap kategori
            cat.tasks.forEach(t => {
                const actualRow = currentRowOffset + t.rowIndex;
                const xPos = opts.categoryLabelWidth + t.x;
                const yPosTask = opts.topHeaderHeight + actualRow * opts.rowHeight;
                // Task rectangle
                const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('x', xPos.toString());
                rect.setAttribute('y', (yPosTask + 5).toString());
                rect.setAttribute('width', t.width.toString());
                rect.setAttribute('height', '40');
                // rect.setAttribute('fill', this.taskStatusColour[t.task.schedule_status]);
                rect.setAttribute('fill', 'white');
                rect.setAttribute('cursor', 'pointer');
                rect.setAttribute('stroke', 'black');
                rect.setAttribute('rx', '1');
                rect.addEventListener('click', () => {
                    this.onTaskClick(t.task);
                });

                if (t.task.schedule_status === 'loaded') {
                    const anim = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
                    anim.setAttribute('attributeName', 'opacity');
                    anim.setAttribute('values', '1;0.5;1');
                    anim.setAttribute('dur', '1s');
                    anim.setAttribute('repeatCount', 'indefinite');
                    rect.appendChild(anim);
                }
                this.svg.appendChild(rect);

                // Indicator status
                // const indicator = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                // indicator.setAttribute('x', xPos.toString());
                // indicator.setAttribute('y', (yPosTask + 5).toString());
                // indicator.setAttribute('width', t.width.toString());
                // indicator.setAttribute('height', '5');
                // indicator.setAttribute('fill', this.taskColor[t.task.schedule_category]);
                // indicator.setAttribute('cursor', 'pointer');
                // indicator.setAttribute('rx', '1');
                // indicator.addEventListener('click', () => {
                //     this.onTaskClick(t.task);
                // });
                // this.svg.appendChild(indicator);

                // Target Entity label
                const textTargetEntity = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                const textTargetEntityX = xPos + t.width / 2;
                const textTargetEntityY = yPosTask + 40;
                textTargetEntity.setAttribute('x', textTargetEntityX.toString());
                textTargetEntity.setAttribute('y', textTargetEntityY.toString());
                textTargetEntity.setAttribute('fill', 'black');
                textTargetEntity.setAttribute('font-size', '15');
                textTargetEntity.setAttribute('font-weight', 'bold');
                textTargetEntity.setAttribute('text-anchor', 'middle');
                textTargetEntity.setAttribute('cursor', 'pointer');
                textTargetEntity.textContent = t.task.target_entity;
                this.svg.appendChild(textTargetEntity);

                // Task label
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                const textX = xPos + t.width / 2;
                const textY = yPosTask + 25;
                text.setAttribute('x', textX.toString());
                text.setAttribute('y', textY.toString());
                text.setAttribute('fill', 'black');
                text.setAttribute('font-size', '15');
                text.setAttribute('font-weight', 'bold');
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('cursor', 'pointer');
                text.textContent = t.task.schedule_name;
                text.addEventListener('click', () => {
                    this.onTaskClick(t.task);
                });
                this.svg.appendChild(text);
            });
            currentRowOffset += catRows;
        });
    }
}

export { GanttChart }