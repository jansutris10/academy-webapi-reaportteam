'use strict';
var app = require('../../server/server');

module.exports = function(Report) {
    Report.status = function(cb) {
        var currentDate = new Date();
        var currentHour = currentDate.getHours();
        var OPEN_HOUR = 8;
        var CLOSE_HOUR = 17;
        console.log('Current hour is %d:%d', currentHour,currentDate.getMinutes());
        var response;
        if (currentHour > OPEN_HOUR && currentHour < CLOSE_HOUR) {
        response = 'Masih jam kerja.';
        } else {
        response = 'Tidak jam kerja.';
        }
        cb(null, response);
    };


    Report.remoteMethod(
        'status', {
        http: {
            path: '/status',
            verb: 'get'
        },
        returns: {
            arg: 'status',
            type: 'string'
        }
        }
    );
    
    Report.countAssignment = function(account_id,cb){
        app.models.Assignment.count({accountId: account_id},function(err, count){
        if(err || account_id === 0)
            return cb(err);
        else {
            console.log(count);
            cb(null, count);
        }
        })
    };


  Report.remoteMethod("countAssignment",
    {
        accepts: [{ arg: 'accountId', type: 'string'}],
        http: { path:"/:account_id/count", verb: "get", errorStatus: 401,},
        description: ["Get number of assignments every Account"],
        returns: {arg: "count", type: "number"}
  })







Report.countEfficiency = function (id,cb){
    app.models.Assignment.find({where: {and: [{accountId: id},{status: "closed"}]}},function(err, assigments){
      if(err || id === 0)
         return cb(err);
      else {
        var elapsed = 0;
        var budget = 0;
        var efficiency = 0;

   
//    var origArr = [
//         app.models.Assignment.find({where: {and: [{accountId: id},{status: "closed"}]}},function(err, assigments){
//    ];

//    function groupBy(arr,key)

        for(var items of assigments){
          budget = budget + items.budget;
          elapsed = elapsed + items.elapsed;
        } 
        efficiency = (elapsed/budget)*100 ;
        console.log(efficiency);
        cb(null, efficiency);
      } 
    })
  };

  Report.remoteMethod("countEfficiency",
    {
        accepts: [{ arg: 'id', type: 'string'}],
        http: { path:"/:id/count/efficiency", verb: "get", errorStatus: 401,},
        description: ["Get efficiency every Account"],
        returns: {arg: "efficiency", type: "decimal"}
  })


















//   Report.getAccountTasks = function(account_id,cb){
//         app.models.Task.find({where: {AssignmentaccountId: account_id}},function(err, Tasks){
//         if(err || account_id === 0)
//             return cb(err);
//         else {
//             console.log(projects);
//             cb(null, projects);
//         }
//         })
//     };


//   Report.remoteMethod("getAccountTasks",
//     {
//         accepts: [{ arg: 'accountId', type: 'string'}],
//         http: { path:"/:account_id/projects", verb: "get", errorStatus: 401,},
//         description: ["Get projects every Account"],
//         returns: {arg: "Tasks", type: "array"}
//   })

};

 