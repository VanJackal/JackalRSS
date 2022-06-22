import {init} from 'jrss-db'
import * as mongoose from 'mongoose'
before(() => {
    init()
})
after(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
})
