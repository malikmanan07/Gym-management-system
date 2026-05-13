class AttendanceDTO {
    static _formatTo12Hr(timeStr) {
        if (!timeStr) return null;
        try {
            const [hours, minutes] = timeStr.split(':');
            const h = parseInt(hours);
            const ampm = h >= 12 ? 'PM' : 'AM';
            const hh = h % 12 || 12;
            return `${hh}:${minutes} ${ampm}`;
        } catch (e) {
            return timeStr;
        }
    }

    static toSummary(log) {
        if (!log) return {};
        return {
            id: log.id,
            memberId: log.memberId,
            memberName: log.Member ? `${log.Member.firstName} ${log.Member.lastName}` : 'Unknown',
            date: log.date,
            checkIn: this._formatTo12Hr(log.checkIn),
            checkOut: this._formatTo12Hr(log.checkOut),
            status: log.checkOut ? 'completed' : 'active'
        };
    }

    static toDailyStats(logs) {
        return (logs || []).map(log => this.toSummary(log));
    }
}

module.exports = AttendanceDTO;
