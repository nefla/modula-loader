var io = require('../lib/io');

function mapFolders(dir, folders, opts){
  var map = {}; // mapping modules
  var obj = {}; // hold a single mapping
  var task;     // combines dir + path in order to require modules
  var modul;    // holds a module

  // in case options are provided,
  // build an array to be used with fn.apply later on
  var args;
  if (opts !== undefined) {
    var args = Object.keys(opts).map(function(key){
      return opts[key];
    });
  }

  // maps the root
  var files = io.getFiles(dir);
  if (files.length > 0){
    files.forEach(function(file){
      file = file.replace('.js', '');
      task = dir + '/' + file;
      modul = requirer(task, opts, args);
      obj[file] = modul;
      map[file] = modul;
      map['root'] = obj;
    });
  }

  // maps subdir
  folders.forEach(function(folder){
    obj = {};
    files = io.getFiles(dir + '/' + folder);
    files.forEach(function(file){
      file = file.replace('.js', '');
      task = dir + '/' + folder + '/' + file;
      modul = requirer(task, opts, args);
      obj[file] = modul;
      map[file] = modul;
    });
    map[folder] = obj;
  });

  return map;
}

function mapFiles(dir, opts){
  var map = {}; // modules mapping
  var task;     // combines dir + path to be required later on
  var modul;    // holds a module

  // in case options are provided,
  // build an array to be used with fn.apply later on
  var args;
  if (opts !== undefined){
    var args = Object.keys(opts).map(function(key){
      return opts[key];
    });
  }

  var files = io.getFiles(dir);
  files.forEach(function(file){
    file = file.replace('.js', '');
    task = dir + '/' + file;
     modul = requirer(task, opts, args);
     map[file] = modul;

  });
  return map;
}

function requirer(task, opts, args){
  return opts
    ? require(task).apply(null, args)
    : require(task);
}

var reflect = {
  mapFiles: mapFiles,
  mapFolders: mapFolders
};

module.exports = reflect;