// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

class UserProfile {
    constructor(name, age,apellido) {
        this.name = name;
        this.age = age;
        this.apellido=apellido;
        // The list of companies the user wants to review.
        this.companiesToReview = [];
        this.companiesRequest =[];
    }
}

module.exports.UserProfile = UserProfile;
