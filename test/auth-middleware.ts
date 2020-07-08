import { expect } from 'chai';
import jsonwebtoken from 'jsonwebtoken';
import sinon from 'sinon';

import authMiddleware from '../src/middleware/is-auth';

describe('Auth Middleware', () => {
  it('gives error if no authorization header is present', function () {
    const req = {
      get: function () {
        return null;
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      'Not authenticated.'
    );
  });

  it('should throw error if authorization header is only one string', function () {
    const req = {
      get: function () {
        return 'xyz';
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it('should throw an error if the token cannot be verified', function () {
    const req = {
      get: function () {
        return 'Bearer xyz';
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      'jwt malformed'
    );
  });

  // it('should yield a userId after decoding the token', function () {
  //   const req = {
  //     get: function () {
  //       return 'Bearer xyz';
  //     },
  //   };
  //   sinon.stub(jsonwebtoken, 'verify');
  //   jsonwebtoken.verify.returns({ userId: 'abc' });
  //   authMiddleware(req, {}, () => {});
  //   expect(req).to.have.property('userId');
  //   jsonwebtoken.verify.restore();
  // });
});
