import { useState } from "react";

const MapTest = () => {
	const { naver } = window;
	const [myLocation, setMyLocation] = useState<
		{ latitude: number; longitude: number } | string
	>("");

	return <div id="map" style={{ width: "100%", height: "500px" }} />;
};
