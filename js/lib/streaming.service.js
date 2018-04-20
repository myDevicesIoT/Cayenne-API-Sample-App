import settings from '../config/settings';
import session from '../config/session';

export default class StreamingService{
    static _instance = null;
    _subscribers = {};


    constructor(){
        this.init();
    }

    init(){
        var url = settings.streamingHost + `?token=${session.access_token}&transport=websocket`;
        url=url.replace('https', 'wss');
        var ws = new WebSocket(url);

        ws.onmessage = this.notify.bind(this);

        ws.onerror = (e) => {
            // an error occurred
            console.log(e.message);
        };

        ws.onclose = this.init.bind(this);
    }

    guid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
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
        var subscriberId = this.guid();
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