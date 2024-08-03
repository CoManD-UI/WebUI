import axios from "axios";
import {BaseClient} from "./BaseClient";

class ListOfLinksClient extends BaseClient {
    async getItems(language, filename) {
        const response = await axios.get(this.getUrl('/' + filename + '-' + language +'.json'))
        return response.data
    }
}

export const listOfLinksClient = new ListOfLinksClient()