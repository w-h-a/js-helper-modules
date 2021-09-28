const isRequired =
    value =>
        !(value === "");


const isBetween =
    (length, min, max) =>
        !(length < min || length > max);


const isEmailValid =
    email =>
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test (email);


const isPasswordSecure =
    password =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test (password);


const isTelValid =
    tel =>
        tel === "" || /^\d{10}$/.test (tel);
