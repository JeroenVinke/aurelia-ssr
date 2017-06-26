//import {computedFrom} from 'aurelia-framework';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Welcome = (function () {
    function Welcome() {
        this.heading = 'Welcome to the Aurelia Navigation App';
        this.firstName = 'John';
        this.lastName = 'Doe';
        this.previousValue = this.fullName;
    }
    Object.defineProperty(Welcome.prototype, "fullName", {
        //Getters can't be directly observed, so they must be dirty checked.
        //However, if you tell Aurelia the dependencies, it no longer needs to dirty check the property.
        //To optimize by declaring the properties that this getter is computed from, uncomment the line below
        //as well as the corresponding import above.
        //@computedFrom('firstName', 'lastName')
        get: function () {
            return this.firstName + " " + this.lastName;
        },
        enumerable: true,
        configurable: true
    });
    Welcome.prototype.submit = function () {
        this.previousValue = this.fullName;
        alert("Welcome, " + this.fullName + "!");
    };
    Welcome.prototype.canDeactivate = function () {
        if (this.fullName !== this.previousValue) {
            return confirm('Are you sure you want to leave?');
        }
    };
    return Welcome;
}());
exports.Welcome = Welcome;
var UpperValueConverter = (function () {
    function UpperValueConverter() {
    }
    UpperValueConverter.prototype.toView = function (value) {
        return value && value.toUpperCase();
    };
    return UpperValueConverter;
}());
exports.UpperValueConverter = UpperValueConverter;
