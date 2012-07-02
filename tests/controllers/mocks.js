module.exports = function ( app, model, args ) {
  args.test.ok( app.name === 'thisIsExpress', 'express app has been passed into route for routing');
  args.test.ok( model.name === 'mockSchema', 'Corresponding model has been passed into route');
  args.test.ok( model.init, 'Model has been initialized via setupFunction in initModels when it\'s passed into the route' );
  args.test.ok( args.name === 'controllerArgs', 'controller arguments succesfully passed into route');
  args.test.done();
};
