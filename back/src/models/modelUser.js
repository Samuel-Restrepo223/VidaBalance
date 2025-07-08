import { match } from 'assert';
import { Schema, model} from 'mongoose';


const schemaUser = new Schema({
    name: {type: String, required: true, trim: true},
    email: {
        type: String, 
        required: true,
        match:[/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, "email ivalid"]
    },
    password: {
        type: String, 
        required: true,
        trim: true, 
        match:[/^(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`])\S+$/,"password invalid"] 
    },
   
});

export default model ('User', schemaUser);