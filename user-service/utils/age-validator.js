module.exports = {
    checkAgeOver18: function checkAgeOver18(dob) {
        var age = new Date().getFullYear() - new Date(dob).getFullYear();
        return age >= 18;
    }
};