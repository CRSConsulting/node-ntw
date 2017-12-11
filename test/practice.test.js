const sinon = require('sinon');
const fs = require('fs');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const expect = chai.expect;

// We need to have filename defined somewhere...
const filename = 'foo';
function fileContents() {
  return new Promise(((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) { reject(err); } else { resolve(data); }
    });
  }));
}

describe('Testing fileContents', () => {
  afterEach(() => {
    fs.readFile.restore();
  });

  it('should return the contents of the fallBack file', () => {
    const fakeContents = '<div class="some-class">some text</div>';

    sinon.stub(fs, 'readFile').yields(null, fakeContents);

    const fileContentsPromise = fileContents();

    return expect(fileContentsPromise).to.eventually.equal(fakeContents);
  });
});
