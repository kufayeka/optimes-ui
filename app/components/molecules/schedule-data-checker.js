/**
 * Transform API response data to be compatible with GanttChart
 * @param {Array} apiData - Raw data from API
 * @returns {Array} Transformed data compatible with GanttChart
 */
export function transformScheduleData(apiData) {
  if (!Array.isArray(apiData)) {
    console.warn('transformScheduleData: Input is not an array', apiData);
    return [];
  }

  return apiData.map(item => {
    // Validate required fields
    if (!item.id || !item.schedule_category || !item.planned_start_time || !item.planned_finish_time) {
      console.warn('transformScheduleData: Missing required fields', item);
      return null;
    }

    // Transform the data to match GanttChart expected format
    const transformed = {
      // Required fields
      id: item.id,
      schedule_category: item.schedule_category,
      planned_start_time: item.planned_start_time,
      planned_finish_time: item.planned_finish_time,
      schedule_status: item.schedule_status || 'planned',
      
      // Extract target_entity from routing_name or use default
      target_entity: item.schedule_data?.routing_name?.title || 
                    item.schedule_data?.routing_name?.value || 
                    item.schedule_data?.routing || 
                    'Unknown Entity',
      
      // Create schedule_name from work_order_number and material
      // schedule_name: item.schedule_data?.work_order_number 
      //   ? `${item.schedule_data.work_order_number}${item.schedule_data.material ? ` (${item.schedule_data.material})` : ''}`
      //   : item.schedule_name || 'Unnamed Schedule',
      
      // Keep original schedule_data
      schedule_data: {
        ...item.schedule_data,
        // Flatten routing_name if it's an object
        routing_name: typeof item.schedule_data?.routing_name === 'object' 
          ? item.schedule_data.routing_name.title || item.schedule_data.routing_name.value
          : item.schedule_data?.routing_name
      },
      
      // Keep other original fields
      created_at: item.created_at,
      updated_at: item.updated_at
    };

    return transformed;
  }).filter(item => item !== null); // Remove invalid items
}

/**
 * Validate if data is compatible with GanttChart
 * @param {Array} data - Data to validate
 * @returns {Object} Validation result with isValid and errors
 */
export function validateGanttData(data) {
  const errors = [];
  
  if (!Array.isArray(data)) {
    return { isValid: false, errors: ['Data must be an array'] };
  }

  if (data.length === 0) {
    return { isValid: false, errors: ['Data array is empty'] };
  }

  data.forEach((item, index) => {
    const requiredFields = ['id', 'schedule_category', 'planned_start_time', 'planned_finish_time'];
    
    requiredFields.forEach(field => {
      if (!item[field]) {
        errors.push(`Item ${index}: Missing required field '${field}'`);
      }
    });

    // Validate schedule_category values
    const validCategories = ['production', 'maintenance', 'other'];
    if (item.schedule_category && !validCategories.includes(item.schedule_category)) {
      errors.push(`Item ${index}: Invalid schedule_category '${item.schedule_category}'. Must be one of: ${validCategories.join(', ')}`);
    }

    // Validate schedule_status values
    const validStatuses = ['planned', 'loaded', 'unloaded', 'suspended'];
    if (item.schedule_status && !validStatuses.includes(item.schedule_status)) {
      errors.push(`Item ${index}: Invalid schedule_status '${item.schedule_status}'. Must be one of: ${validStatuses.join(', ')}`);
    }

    // Validate date format
    if (item.planned_start_time && isNaN(new Date(item.planned_start_time).getTime())) {
      errors.push(`Item ${index}: Invalid planned_start_time format`);
    }
    
    if (item.planned_finish_time && isNaN(new Date(item.planned_finish_time).getTime())) {
      errors.push(`Item ${index}: Invalid planned_finish_time format`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Debug helper to show data structure
 * @param {Array} originalData - Original API data
 * @param {Array} transformedData - Transformed data
 */
export function debugDataTransformation(originalData, transformedData) {
  console.group('Data Transformation Debug');
  
  console.log('Original Data Sample:', originalData[0]);
  console.log('Transformed Data Sample:', transformedData[0]);
  
  console.log('Original Count:', originalData.length);
  console.log('Transformed Count:', transformedData.length);
  
  const validation = validateGanttData(transformedData);
  console.log('Validation Result:', validation);
  
  if (!validation.isValid) {
    console.error('Validation Errors:', validation.errors);
  }
  
  console.groupEnd();
}