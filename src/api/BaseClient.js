export class BaseClient {
    static BASE_URL = `/templates/pages/data`

    getUrl(path) {
        return `${BaseClient.BASE_URL}${path}`;
    }
}
