import {app} from './app.js';
import  connectDB  from './Config/db.js';

connectDB()
.then(() => {
    
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port http://localhost:${process.env.PORT}/`);
    });
})
.catch((error) => {
    console.error('Failed to connect to the database:', error);
});