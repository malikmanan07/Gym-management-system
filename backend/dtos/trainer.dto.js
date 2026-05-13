class TrainerDTO {
    static toSummary(trainer) {
        if (!trainer) return {};
        return {
            id: trainer.id,
            fullName: trainer.fullName,
            email: trainer.email,
            phone: trainer.phone,
            specialization: trainer.specialization,
            experienceYears: trainer.experienceYears,
            bio: trainer.bio
        };
    }

    static toList(trainers) {
        return (trainers || []).map(t => this.toSummary(t));
    }
}

module.exports = TrainerDTO;
