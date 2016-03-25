import {inject} from "aurelia-framework";
import {HttpClient} from "aurelia-http-client";

@inject(HttpClient)
export class FlickrSortable{
  heading = "Flickr";
  images = [];
  url = "http://api.flickr.com/services/feeds/photos_public.gne?tags=mountain&tagmode=any&format=json";

  constructor(http){
    this.http = http;
  }

  attached() {
    document.body.parentElement.classList.add( "sortable-scroll" );
  }
  detached() {
    document.body.parentElement.classList.remove( "sortable-scroll" );
  }

  activate(){
    return this.http.jsonp(this.url).then(response => {
      this.images = response.content.items;
    });
  }

  moved() {
  }
}
