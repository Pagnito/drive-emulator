import React, { Component } from 'react'
import DeckGL, {IconLayer} from 'deck.gl';
import carIcon from '../assets/redCar.png';
import * as turf from '@turf/turf';
export default class arcLayer extends Component {


render() {
 

   var data = [
       { prevCoordinates: this.props.egoPoints[0],
         directionCoordinates:this.props.egoPoints[1],
         iconBearing: -this.props.egoBearing+55/*-175*/}]
     
                
    
    const layers = [
        
      new IconLayer({
          id: 'icon-layer',
          data: data,
          pickable: true,
          iconAtlas: carIcon,
          fp64: true,
          iconMapping: {
            marker: {
              x: 0,
              y: 0,
              width: 80,
              height: 175,
             
            }
          },
          sizeScale: 20,
          getSize: d=>7,
          getPosition: d=>[-70.97811884489,42.61957039095],
          getIcon: d=>'marker',
          getAngle: d=> d.iconBearing
      })
    ];

    return (
      <DeckGL {...this.props.viewport} layers={layers}/>
    );
  }

  
}
