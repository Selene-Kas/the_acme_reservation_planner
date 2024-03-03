const express= require('express');
const app = express();
app.use(express.json());

const { 
  client,
  createTables,
  createCustomer,
  createRestaurant,
  createReservation,
  fetchCustomers,
  fetchRestaurants,
  fetchReservations,
  destroyReserveation
 } = require('./db');

  app.get('/api/customers', async (req, res, next) => {
    try {
    res.send(await fetchCustomers());
    } catch(err) {
        next(err);
    }
  });

  app.get('/api/restaurants', async (req, res, next) => {
    try{  
      res.send(await fetchRestaurants());
    } catch(err) {
    next(err);
    }
  });

  app.get('/api/reservations', async (req, res, next) => {
    try {
      res.send(await fetchReservations());
    } catch(err) {
        next(err);
    }
  });

  app.post('/api/reservations', async (req, res, next) => {
    const { date, party_count, customer_id, restaurant_id } = req.body;
    try {
      res.status(201).send(await createReservation(date, party_count, customer_id, restaurant_id));
    } catch(err) {
      next(err);
    }
  });

  app.post('/api/customers/:id/reservations', async (req, res, next) => {
    const { date, restaurant_id, party_count } = req.body;
    try {
      res.status(201).send(await createReservation(date, restaurant_id, party_count));
    } catch(err) {
      next(err);
    }
  });

  app.delete('/api/customers/:id/reservations/:id', async (req, res, next) => {
    try {
      await destroyReserveation(req.params.id);
      res.sendStatus(204);
    } catch(err) {
      next(err);
    }
  });

  // error handling route, return error message 
    app.use((err, req, res, next) => {
      res.status(500).send({error: err.message});
    });

  async function init() {
    try {
    await client.connect();
    console.log('connected to the database');
    await createTables();
    console.log('tables created');
    const[harry, hermoine, ron , pizzaria, skinnyfats, jinya, sushibar ] = await Promise.all([
      createCustomer('Harry'),
      createCustomer('Hermoine'),
      createCustomer('Ron'),
      createRestaurant('Pizzaria'),
      createRestaurant('Skinnyfats'),
      createRestaurant('Jinya'),
      createRestaurant('Sushibar')
    ]);
    console.log(await fetchCustomers());
    console.log(await fetchRestaurants());
    const [rev1, rev2, rev3, rev4] = await Promise.all([ 
      createReservation('2020-02-02', 3 , harry.id, pizzaria.id),
      createReservation('2020-02-02', 4 , hermoine.id, skinnyfats.id),
      createReservation('2020-02-02', 5 , ron.id, jinya.id),
      createReservation('2020-02-02', 2 , hermoine.id, sushibar.id),
    ]);
    await destroyReserveation(rev1.id);
    console.log(await fetchReservations());

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => { 
        console.log(`listening on port ${PORT}`);
    });
  } catch(err) {
    console.error(err);
  }
}
init();