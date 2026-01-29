/**
 * Format Date to HH:MM:SS DD/MM/YYYY format for Google Sheet
 * Uses Vietnam timezone (Asia/Ho_Chi_Minh, GMT+7)
 * @param date - Date object to format
 * @returns Formatted string: "HH:MM:SS DD/MM/YYYY"
 * @example formatDateTime(new Date()) // "14:35:52 16/01/2026"
 */
export function formatDateTime(date: Date): string {
    // Convert to Vietnam timezone (GMT+7)
    const vietnamTime = new Date(date.toLocaleString('en-US', { 
      timeZone: 'Asia/Ho_Chi_Minh' 
    }));
    
    const day = String(vietnamTime.getDate()).padStart(2, '0');
    const month = String(vietnamTime.getMonth() + 1).padStart(2, '0');
    const year = vietnamTime.getFullYear();
    const hours = String(vietnamTime.getHours()).padStart(2, '0');
    const minutes = String(vietnamTime.getMinutes()).padStart(2, '0');
    const seconds = String(vietnamTime.getSeconds()).padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
  }
  
  /**
   * Parse Vietnamese datetime format back to Date object
   * @param dateTimeString - String in format "HH:MM:SS DD/MM/YYYY"
   * @returns Date object in Vietnam timezone
   * @example parseVietnameseDateTime("14:35:52 16/01/2026")
   */
  export function parseVietnameseDateTime(dateTimeString: string): Date {
    // Format: "HH:MM:SS DD/MM/YYYY"
    const [timePart, datePart] = dateTimeString.split(' ');
    const [hours, minutes, seconds] = timePart.split(':').map(Number);
    const [day, month, year] = datePart.split('/').map(Number);
    
    // Create date in Vietnam timezone
    // Note: Month is 0-indexed in JavaScript Date
    const date = new Date(year, month - 1, day, hours, minutes, seconds);
    
    return date;
  }
