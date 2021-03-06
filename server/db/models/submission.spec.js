// /* global describe beforeEach it */

const {expect} = require('chai')
const db = require('../db')
const Submission = require('./Submission')

describe('Submission model', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })

  describe('instanceMethods', () => {
    describe('correctPassword', () => {
      let submission

      beforeEach(async () => {
        submission = await Submission.create({})
      })

      it('subtracts', ()=> {
        expect(2-1).to.equal(1)
      })
      it('a submission can be created', ()=> {
        expect(submission.id).to.be.ok
      })


    })
  })
})
