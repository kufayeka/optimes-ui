// filepath: /home/jvt/.node-red/public/optimes-ui/app/components/helpers/transformScheduleDataForGantt.js
export function transformScheduleDataForGantt(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map(item => {
    const src = item.populated || item.raw || {};
    return {
      id: src.id,
      schedule_category: detectCategory(src),
      target_entity: src.routing || '',
      schedule_status: src.schedule_status || 'planned',
      planned_start_time: src.planned_start_time,
      planned_finish_time: src.planned_finish_time,
      schedule_data: {
        shift: src.shift || '',
        routing: src.routing || '',
        material: src.material || '',
        quantity_unit: src.quantity_unit || '',
        quantity_order: src.quantity_order || 0,
        work_order_number: src.work_order || '',
        sales_order_number: src.sales_order || ''
      },
      schedule_name: src.schedule_notes || src.work_order || src.id
    };
  });
}

function detectCategory(src) {
  if ((src.schedule_notes || '').toLowerCase().includes('maintenance')) return 'maintenance';
  if (src.schedule_category) return src.schedule_category;
  return 'production';
}