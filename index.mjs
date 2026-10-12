import {fetchUser} from "./api.mjs"

const user = await fetchUser("d-odumosu");
console.log(user);