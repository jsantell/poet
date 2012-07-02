var
  app = { name: 'thisIsExpress' },
  modelPath = __dirname + '/models/',
  controllerPath = __dirname + '/controllers/',
  modelArgs = { name: 'modelArgs' },
  controllerArgs = { name: 'controllerArgs' },
  mvc = require('../index.js')( app );

module.exports = {
  'initModels' : function ( test ) {
    test.expect( 3 );
    
    mvc.initModels( [ 'Mock' ], modelPath, function ( name, schema ) {
      test.ok( name === 'Mock', 'Model setup function is passing in correct name' );
      test.ok( schema.name === 'mockSchema', 'Model setup function is passing in correct return from Model definition' );

      test.ok( schema.args.name === 'modelArgs', 'Model correctly passes in model arguments into the Model definition' );
      test.done();

      // For routes test
      schema.init = true;
      return schema;
    }, modelArgs );
  },

  'initRoutes' : function ( test ) {
     test.expect( 4 );
     controllerArgs.test = test;
     mvc.initRoutes( [ 'mocks' ], controllerPath, controllerArgs );
  }

};
