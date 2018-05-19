{
  let APP_ID = 'VEXAs1r3dNI2gCUkAyUI9WQE-gzGzoHsz';
  let APP_KEY = 'hKmTMBaxOQNbfgybSFMzrk7L';

  AV.init({
    appId: APP_ID,
    appKey: APP_KEY
  });

  // var TestObject = AV.Object.extend('Playlist');
  // var testObject = new TestObject();
  // testObject.save({
  //   name: 'test',
  //   cover: 'test',
  //   creatorId: 'test',
  //   description: 'test',
  //   songs: ['1','2']
  // }).then(function(object) {
  //   alert('LeanCloud Rocks!');
  // })
}