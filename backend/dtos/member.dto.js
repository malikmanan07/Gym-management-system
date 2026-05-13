class MemberDTO {
    static toSummary(member) {
        return {
            id: member.id,
            fullName: `${member.firstName} ${member.lastName}`,
            email: member.email,
            phone: member.phone,
            status: member.status,
            joiningDate: member.joiningDate
        };
    }

    static toDetail(member) {
        return {
            ...this.toSummary(member),
            gender: member.gender,
            dob: member.dob,
            address: member.address,
            profileImage: member.profileImage,
            subscriptions: member.MemberSubscriptions ? member.MemberSubscriptions.map(s => ({
                id: s.id,
                planName: s.MembershipPlan ? s.MembershipPlan.name : 'N/A',
                status: s.status,
                expiryDate: s.end_date
            })) : []
        };
    }
}

module.exports = MemberDTO;
