class PaymentDTO {
    static toSummary(payment) {
        if (!payment) return {};
        return {
            id: payment.id,
            memberId: payment.memberId,
            memberName: payment.Member ? `${payment.Member.firstName} ${payment.Member.lastName}` : 'System Record',
            amount: payment.amount,
            paymentMethod: payment.paymentMethod || 'cash',
            paymentDate: payment.paymentDate,
            status: payment.paymentStatus || 'completed'
        };
    }
}

module.exports = PaymentDTO;
