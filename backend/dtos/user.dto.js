class UserDTO {
    static toResponse(user) {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            fullName: user.full_name,
            profileImage: user.profile_image ? `${process.env.APP_URL || 'http://localhost:5000'}/uploads/${user.profile_image}` : null
        };
    }
}

module.exports = UserDTO;
