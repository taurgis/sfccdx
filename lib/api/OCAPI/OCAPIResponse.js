class OCAPIResponse {
    constructor(response) {
        this.status = response.status;
        this.data = response.data;
    }

    isSuccess() {
        return this.status <= 204;
    }

    getFaultMessage() {
        if (this.status > 204) {
            return this.data.fault.message;
        }

        return 'No Fault Message.'
    }
}

module.exports = OCAPIResponse;
