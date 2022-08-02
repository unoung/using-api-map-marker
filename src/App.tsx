import React, {useEffect, useState} from "react";
import "./App.css";
import stores from "./storesList.json";

const App = () => {
  const [myLocation, setMyLocation] = useState<
    {latitude: number; longitude: number} | string
  >("");

  useEffect(() => {
    let map = null;
    const initMap = () => {
      const map = new naver.maps.Map("map", {
        center: new naver.maps.LatLng(36.4203004, 128.31796),
        zoom: 8,
      });

      let busan = new naver.maps.Ellipse({
        map: map,
        bounds: new naver.maps.LatLngBounds(
          new naver.maps.LatLng(34.8799083, 128.7384361),
          new naver.maps.LatLng(35.3959361, 129.3728194)
        ),
        strokeColor: "transparent",
        strokeOpacity: 0,
        strokeWeight: 0,
        fillColor: "transparent",
        fillOpacity: 0,
        clickable: true,
      });

      let daegu = new naver.maps.Ellipse({
        map: map,
        bounds: new naver.maps.LatLngBounds(
          new naver.maps.LatLng(35.798838, 127.983052),
          new naver.maps.LatLng(36.276441, 128.992689)
        ),
        strokeColor: "transparent",
        strokeOpacity: 1,
        strokeWeight: 1,
        fillColor: "transparent",
        fillOpacity: 0.3,
        clickable: true,
      });

      naver.maps.Event.addListener(busan, "click", function () {
        map.fitBounds(busan.getBounds());
      });

      naver.maps.Event.addListener(daegu, "click", function () {
        map.fitBounds(daegu.getBounds());
      });

      // 주변 마커 나타내기
      const markers: naver.maps.Marker[] = [];
      const infowindows: naver.maps.InfoWindow[] = [];
      stores.stores.Gyeongsangdo.map(
        (list) => {
          const contentTags = `<div style="padding:18px;height:150px;box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.3);">
										<div class="content_wrap">
											<h1>${list.egName}</h1>
											<p>${list.koName}</p>
											<p>${list.address}</p>
											<p>${list.telNum}</p>
										</div>

										<div class="btn_wrap">
											<button><a href='tel:${list.telNum}}' style="text-decoration:none; color:white">전화</a></button>
											<button onclick="location.href='${list.addressLink}';">지도</button>
											<button onclick="location.href='${list.directionLink}'">길찾기</button>
										<div>
									</div>	`;

          const otherMarkers = new naver.maps.Marker({
            position: new naver.maps.LatLng(list.lat, list.lng),
            map,
          });

          const infowindow = new naver.maps.InfoWindow({
            content: contentTags,
            maxWidth: 260,
            pixelOffset: new naver.maps.Point(10, -10),
            anchorSize: new naver.maps.Size(15, 3),
            borderWidth: 0,
            anchorColor: "white",

            // backgroundColor: "transparent",
          });

          markers.push(otherMarkers);
          infowindows.push(infowindow);
        },
        naver.maps.Event.addListener(map, "idle", () => {
          updateMarkers(map, markers);
        })
      );
      const updateMarkers = (
        isMap: naver.maps.Map,
        isMarkers: naver.maps.Marker[]
      ) => {
        const mapBounds: any = isMap.getBounds();
        let marker;
        let position;

        for (let i = 0; i < isMarkers.length; i += 1) {
          marker = isMarkers[i];
          position = marker.getPosition();

          if (mapBounds.hasLatLng(position)) {
            showMarker(isMap, marker);
          } else {
            hideMarker(marker);
          }
        }
      };
      const showMarker = (isMap: naver.maps.Map, marker: naver.maps.Marker) => {
        marker.setMap(isMap);
      };

      const hideMarker = (marker: naver.maps.Marker) => {
        marker.setMap(null);
      };
      const getClickHandler = (seq: number) => {
        return () => {
          const marker = markers[seq];
          const infoWindow = infowindows[seq];

          if (infoWindow.getMap()) {
            infoWindow.close();
          } else {
            infoWindow.open(map, marker);
          }
        };
      };
      for (let i = 0; i < markers.length; i += 1) {
        naver.maps.Event.addListener(markers[i], "click", getClickHandler(i));
      }
    };
    initMap();
  }, [myLocation]);

  //지도 사이즈 관련 스타일
  const mapStyle = {
    width: "100%",
    height: "100vh",
  };

  return (
    <React.Fragment>
      <div id="map" style={mapStyle}></div>
    </React.Fragment>
  );
  // };
};
export default App;
