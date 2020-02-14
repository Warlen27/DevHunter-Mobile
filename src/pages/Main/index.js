import React, { useEffect, useState } from 'react';

import MapView, { Marker, Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

import { Avatar, Name, Bio, Techs, Form, Input, Button } from './styles'

import api from '../../services/api';

import { connect, disconnect, subscribeToNewDevs } from '../../services/socket';




export default function Main({ navigation }) {
  const [currentRegion, setCurrentRegion] = useState(null);
  const [devs, setDevs] = useState([]);
  const [techs, setTechs] = useState('');
    useEffect(() => {
      async function getLocation() {
          const { granted } = await requestPermissionsAsync();

          if(granted) {
            const { coords } = await getCurrentPositionAsync({
                enableHighAccuracy: false,
            })

            const { latitude, longitude } = coords;

            setCurrentRegion({
              latitude,
              longitude,
              latitudeDelta: 0.04,
              longitudeDelta: 0.04,
            })
          }
      }

      getLocation();
    }, []);

    useEffect(() => {
      subscribeToNewDevs(dev => setDevs([...devs, dev]));
    }, [devs]);

    function setupWebSocket(){

      const { latitude, longitude } = currentRegion;
      connect({
        latitude,
        longitude,
        techs,
      });
    }

    async function loadDevs() {

      const { latitude, longitude } =  currentRegion;

      const response = await api.get('/search', {
        params: {
          latitude,
          longitude,
          techs
        }
      })

      setDevs(response.data.devs);
      setupWebSocket();

    }

    function handleRegionChanged(region) {
        setCurrentRegion(region);
    }

if(!currentRegion) {
  return null;
}

mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#181818"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1b1b1b"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#2c2c2c"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8a8a8a"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#373737"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3c3c3c"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#4e4e4e"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3d3d3d"
      }
    ]
  }
]

  return (
      <>
     
      <MapView 
      customMapStyle = { mapStyle }
      mapType="standard"
      onRegionChangeComplete={handleRegionChanged}
      style={ { flex: 1 } } 
      initialRegion={currentRegion}
      >
       {devs.map(dev => (
          <Marker 
          key={dev._id}
          coordinate={{ 
            longitude: dev.location.coordinates[0],
            latitude: dev.location.coordinates[1], 
          }}
          >
          <Avatar source={{ uri: dev.avatar_url }} />

          <Callout style={{ width: 260 }}
          onPress={() => { navigation.navigate('Profile', { github_username: dev.github_username }) }}
          >
              <Name>{dev.name}</Name>
              <Bio>{dev.bio}</Bio>
              <Techs>{dev.techs.join(', ')}</Techs>
          </Callout>
        </Marker>
       ))}

        
      </MapView>

      <Form>
      <Input style={{ shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 4, height: 4 }, elevation: 4 }}
      placeholder="Buscar dev por techs..."
      placeholderTextColor="#999"
      autoCapitalize="words"
      autoCorrect={false}
      value={techs}
      onChangeText={setTechs}
      /> 
        <Button onPress={loadDevs}>
            <MaterialIcons name="my-location" size={20} color="#fff" />
        </Button>

      </Form>  
  
      </>
  );
}
