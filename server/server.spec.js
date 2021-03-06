const expect = require('chai').expect;
const User = require('./db/models/user')
const Submission = require('./db/models/Submission')
const Game = require('./db/models/Game')
const seed = require('../script/seed');
const app = require('supertest')(require('./index'));

const server = require('./index');

const request = require('supertest')

describe('an authenticated user can log in ', ()=> {

  before( async ()=> {
    await seed();

    await request(server)
      .post('/auth/login')
      .send({ email: 'zi@email.com', password: 'ZI' })
      .expect(200);
  });

  it('and see all their games', ()=> {
    return app.get('/api/games')
      .expect(200)
      .then(res => {
        const games = res.body;
        expect(games.length).to.equal(3);
      })
  });

});


describe('Seeded models', ()=> {

  beforeEach(()=> seed());

  describe('Seeded Users', ()=> {
    it('has three users', async ()=> {
      const users = await User.findAll();
      expect(users.length).to.equal(5); // change this expectation if seeding more users
    });
  });

  describe('Seeded Game', ()=> {
    it('has two games', async ()=> {
      const games = await Game.findAll();
      expect(games.length).to.equal(3);
    });
  });

});


describe('Playing the game', ()=> {

  xit('can play a full round', async ()=> {
    const zi = await User.findOne({ where: { email: 'zi@email.com' }});
    const emily = await User.findOne({ where: { email: 'emily@email.com' }});
    const cang = await User.findOne({ where: { email: 'cang@email.com' }});
    return app.post('/api/games')
      .set({user: cang}) // not sure how to add the user in the super test
      .send({ players: [ zi.id, emily.id, cang.id ] })
      .expect(200)
      .then( async (response) => {
        expect(response).to.be.ok;
        const createdGame = await Game.findOne({
          where: {
            status: 'active',
            id: response.body.id
          },
          include: [Submission]
        });
        expect(createdGame).to.be.ok;
        expect(createdGame.submissions.length).to.equal(1);
        expect(createdGame.roundNumber).to.equal(0);

        return app.post(`/api/games/${createdGame.id}/submissions`)
          .send({ type: 'drawing', drawingUrl: 'placeholder-url', gameId: createdGame.id, userId: zi.id }) // a drawing submission
          .expect(200)
          .then( async (response)=> {
            const createdGame = await Game.findOne({
              where: { status: 'active' },
              include: [{
                model: Submission
              }],
              order: [
                [ Submission, 'createdAt', 'ASC']
              ]
            });
            expect(createdGame.roundNumber).to.equal(1);

            return app.get(`/api/games/${createdGame.id}`)
              .expect(200)
              .then( async (response)=> {

              })
          })


      })
  });
});


