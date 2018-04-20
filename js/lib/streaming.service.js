import settings from '../config/settings';
import StorageService from '../lib/storage.service';
import UtilsService from './utils.service';

export default class StreamingService{
    static _instance = null;
    _subscribers = {};


    constructor(){
        this.init();
    }

    async init(){
        var url = settings.streamingHost + `?token=${await StorageService.get('access_token')}&transport=websocket`;
        url=url.replace('https', 'wss');
        var ws = new WebSocket(url);

        ws.onmessage = this.notify.bind(this);

        ws.onerror = (e) => {
            // an error occurred
            console.log(e.message);
        };

        ws.onclose = this.init.bind(this);
    }

    notify(event){
        if(event.data){
            var index = event.data.indexOf('[');
            var payload = event.data.substring(index, event.data.length);
            try{
                payload = JSON.parse(payload);
                if(payload[0] === 'data-changed'){
                    var subscribers = this._subscribers[payload[0] + payload[1].thingId + payload[1].channel];
                    if(subscribers){
                        subscribers.map(function(subscriber){
                            subscriber.cb(payload[1].value);
                        });
                    }
                }
            }catch(e){}
        }
    }


    subscribe(topic, deviceId, channel, cb){
        var subscriberId = UtilsService.guid();
        if(!this._subscribers[topic + deviceId + channel]){
            this._subscribers[topic + deviceId + channel] = [];
        }
        this._subscribers[topic + deviceId + channel].push({id: subscriberId, cb: cb});
        return subscriberId;
    }

    unsubscribe(topic, deviceId, channel, subscriberId){
        var subscribers = this._subscribers[topic + deviceId + channel];
        var toRemove = subscribers.find((subscriber) => { return subscriber.id === subscriberId; })
        if(toRemove){
            subscribers.splice(subscribers.indexOf(toRemove), 1);
        }
    }
    

    static getInstance(){
        if(this._instance == null){
            this._instance = new StreamingService();
        }
        return this._instance;
    }
}