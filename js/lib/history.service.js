import settings from '../config/settings';
import session from '../config/session';
import StreamingService from './streaming.service';
import PlatformService from './platform.service';

export default class HistoryService{

    /**
     * Get headers used for API calls
     * 
     * @returns {*}
     */
    static getHeaders() {
        return {
            'Authorization': `Bearer ${session.access_token}`
        }
    }

    static getState(deviceId){
        var url = settings.historyHost + deviceId + '/state';
        return fetch(
            url,            
            {
                method: 'GET',
                headers: this.getHeaders()
            })
            .then(function(response){
                return Promise.all([
                    response.json(), 
                    PlatformService.getDataTypes()
                ]).then((promises)=>{
                    var data = promises[0];
                    var datatypes = promises[1];
                    data.map((value) => {
                        var datatype = datatypes.find((type) => {
                            return type.payload_type === value.type;
                        });

                        var unit = datatype.units.find((unit) => {
                            return unit.payload_unit === value.unit;
                        });

                        fakeStreamingEvent = [
                            'data-changed',
                            {
                                thingId: deviceId,
                                channel: value.channel,
                                value: {
                                    value: value.value,
                                    label: unit.unit_label
                                }
                            }
                        ];
                        StreamingService.getInstance().notify({data: JSON.stringify(fakeStreamingEvent)});
                    });
                    return data;
                });
            });
    }
}