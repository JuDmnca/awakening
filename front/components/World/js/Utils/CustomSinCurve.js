import * as THREE from 'three'

class CustomSinCurve extends THREE.Curve {

	constructor( props ) {
		super();
		this.props = props
		this.curve = this.props.curve;
		this.length = this.props.length;
	}

	getPoint( t, optionalTarget = new THREE.Vector3() ) {

		const tx = 0;
		const ty = Math.sin( t * this.curve );
		const tz = t * this.length;

		return optionalTarget.set( tx, ty, tz );

	}

}
export default CustomSinCurve