class OCAPIResponse {
    constructor(response) {
        if (!response) {
            throw new Error('Response is empty.');
        }

        this.status = response.status;
        this.data = response.data;
    }

    isSuccess() {
        return this.status <= 204;
    }

    getFaultMessage() {
        if (this.status > 204 && this.data && this.data.fault && this.data.fault.message) {
            return this.data.fault.message;
        }

        return 'No Fault Message.'
    }
}

module.exports = OCAPIResponse;
