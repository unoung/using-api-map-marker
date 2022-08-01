import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
	const [myLocation, setMyLocation] = useState<
		{ latitude: number; longitude: number } | string
	>("");
	const otherLatLngs = [
		{
			egName: "MONSTER PRO",
			koName: "몬스터 프로",
			address: "부산 기장군 기장읍 반룡산단 1로15",
			telNum: "070-4027-6819",
			lat: 35.33075810000002,
			lng: 129.25184539999984,
		},
		{
			egName: "MOTORS ONE",
			koName: "모터스 원",
			address: "대구 북구 연경동 865",
			telNum: "053-283-1212",
			lat: 35.94031689999973,
			lng: 128.60474979999955,
		},
		{
			egName: "KS CAMPING CAR",
			koName: "케이에스 캠핑카",
			address: "부산 강서구 낙동남로 1030-23",
			telNum: "0507-1428-0502",
			lat: 35.11208949999994,
			lng: 128.92597210000005,
		},
	];
	useEffect(() => {
		let map = null;
		const initMap = () => {
			const map = new naver.maps.Map("map", {
				center: new naver.maps.LatLng(35.33075810000002, 129.25184539999984),
				zoom: 8,
			});

			// 주변 마커 나타내기
			const markers: naver.maps.Marker[] = [];
			const infowindows: naver.maps.InfoWindow[] = [];
			for (let i = 0; i < otherLatLngs.length; i++) {
				const contentTags = `<div style="padding:18px;height:150px;box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.3);">
										<div class="content_wrap">
											<h1>${otherLatLngs[i].egName}</h1>
											<p>${otherLatLngs[i].koName}</p>
											<p>${otherLatLngs[i].address}</p>
											<p>${otherLatLngs[i].telNum}</p>
										</div>

										<div class="btn_wrap">
											<button><a href='tel:010-0000-0000' style="text-decoration:none; color:white">전화</a></button>
											<button onclick="location.href='https://map.naver.com/v5/search/%EC%BC%80%EC%9D%B4%EC%97%90%EC%8A%A4%20%EC%BA%A0%ED%95%91%EC%B9%B4/place/1477772801?c=14351857.1128804,4179124.1116900,17,0,0,0,dh&isCorrectAnswer=true';">지도</button>
											<button onclick="location.href='https://map.naver.com/v5/directions/-/14318078.41564973,4292412.174071528,%EB%AA%A8%ED%84%B0%EC%8A%A4%EC%9B%90,1076103364,PLACE_POI/-/car?c=14318078.4156497,4292412.1740715,15,0,0,0,dh'">길찾기</button>
										<div>
									</div>	
									`;
				// const contentTags = `<div class="naver-container"><p class="ptag" style="font-size:12px;font-weight:bold">${otherLatLngs[i].name}</p></div>`;
				const otherMarkers = new naver.maps.Marker({
					position: new naver.maps.LatLng(
						otherLatLngs[i].lat,
						otherLatLngs[i].lng
					),
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
			}
			naver.maps.Event.addListener(map, "idle", () => {
				updateMarkers(map, markers);
			});
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
};

export default App;
