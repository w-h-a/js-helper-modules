function jsonOfForm (model, idx) {
    return (idx > model.schedCount) ? []
                                    : [ { staff_id: Number (model.form["bstaff_" + idx].value)
                                        , date: model.form["bdate_" + idx].value
                                        , time: model.form["btime_" + idx].value
                                        }
                                      , ...jsonOfForm (model, idx + 1)
                                      ];
}


function jsonOfBooking (model) {
    return { id: Number (model.bookingForm["schedule"].value)
           , student_email: model.bookingForm["studentEmail"].value
           };
}


function jsonOfStudent (model) {
    return { email: model.studentForm["email"].value
           , name: model.studentForm["name"].value
           , booking_sequence: model.studentForm["seq"].value
           };
}
