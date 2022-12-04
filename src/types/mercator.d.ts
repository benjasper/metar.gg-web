declare module 'mercator-projection'
{
	type Coordinate = {lat: number, lng: number};
	type CoordinateCartesian = {x: number, y: number};
	export function fromLatLngToPoint(c: Coordinate): CoordinateCartesian;
}