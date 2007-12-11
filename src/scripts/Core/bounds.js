/**
 * Copyright (c) 2006
 * Martin Czuchra, Nicolas Peters, Daniel Polak, Willi Tscheschner
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 **/

/**
 * Init namespaces
 */
if(!ORYX) {var ORYX = {};}
if(!ORYX.Core) {ORYX.Core = {};}


/**
 * @classDescription With Bounds you can set and get position and size of UIObjects.
 */
ORYX.Core.Bounds = Clazz.extend({

	/**
	 * Constructor
	 */
	construct: function() {
		this._changedCallbacks = []; //register a callback with changedCallacks.push(this.method.bind(this));
		this.a = {};
		this.b = {};
		this.set.apply(this, arguments);
	},
	
	/**
	 * Calls all registered callbacks.
	 */
	_changed: function() {
		this._changedCallbacks.each(function(callback) {
			callback();
		});
	},
	
	/**
	 * Registers a callback that is called, if the bounds changes.
	 * @param callback {Function} The callback function.
	 */
	registerCallback: function(callback) {
		if(!this._changedCallbacks.member(callback)) {
			this._changedCallbacks.push(callback);	
		}
	},
	
	/**
	 * Unregisters a callback.
	 * @param callback {Function} The callback function.
	 */
	unregisterCallback: function(callback) {
			this._changedCallbacks = this._changedCallbacks.without(callback);
	},
	
	/**
	 * Sets position and size of the shape dependent of four coordinates
	 * (set(ax, ay, bx, by);), two points (set({x: ax, y: ay}, {x: bx, y: by});)
	 * or one bound (set({a: {x: ax, y: ay}, b: {x: bx, y: by}});).
	 */
	set: function() {
		
		var changed = false;
		
		switch (arguments.length) {
		
			case 1:
				if(this.a.x !== arguments[0].a.x) {
					changed = true;
					this.a.x = arguments[0].a.x;
				}
				if(this.a.y !== arguments[0].a.y) {
					changed = true;
					this.a.y = arguments[0].a.y;
				}
				if(this.b.x !== arguments[0].b.x) {
					changed = true;
					this.b.x = arguments[0].b.x;
				}
				if(this.b.y !== arguments[0].b.y) {
					changed = true;
					this.b.y = arguments[0].b.y;
				}
				break;
			
			case 2:
				if(this.a.x !== arguments[0].x) {
					changed = true;
					this.a.x = arguments[0].x;
				}
				if(this.a.y !== arguments[0].y) {
					changed = true;
					this.a.y = arguments[0].y;
				}
				if(this.b.x !== arguments[1].x) {
					changed = true;
					this.b.x = arguments[1].x;
				}
				if(this.b.y !== arguments[1].y) {
					changed = true;
					this.b.y = arguments[1].y;
				}
				break;
			
			case 4:
				if(this.a.x !== arguments[0]) {
					changed = true;
					this.a.x = arguments[0];
				}
				if(this.a.y !== arguments[1]) {
					changed = true;
					this.a.y = arguments[1];
				}
				if(this.b.x !== arguments[2]) {
					changed = true;
					this.b.x = arguments[2];
				}
				if(this.b.y !== arguments[3]) {
					changed = true;
					this.b.y = arguments[3];
				}
				break;
		}
		
		if(changed) {
			this._changed();
		}
	},
	
	/**
	 * Moves the bounds so that the point p will be the new upper left corner.
	 * @param {Point} p
	 * or
	 * @param {Number} x
	 * @param {Number} y
	 */
	moveTo: function() {
		
		var currentPosition = this.upperLeft();
		switch (arguments.length) {
			case 1:
				this.moveBy({
					x: arguments[0].x - currentPosition.x,
					y: arguments[0].y - currentPosition.y
				});
				break;
			case 2:
				this.moveBy({
					x: arguments[0] - currentPosition.x,
					y: arguments[1] - currentPosition.y
				});
				break;
			default:
				//TODO error
		}
		
	},
	
	/**
	 * Moves the bounds relatively by p.
	 * @param {Point} p
	 * or
	 * @param {Number} x
	 * @param {Number} y
	 */
	moveBy: function() {
		var changed = false;
		
		switch (arguments.length) {
			case 1:
				var p = arguments[0];
				if(p.x !== 0 || p.y !== 0) {
					changed = true;
					this.a.x += p.x;
					this.b.x += p.x;
					this.a.y += p.y;
					this.b.y += p.y;
				}
				break;	
			case 2:
				var x = arguments[0];
				var y = arguments[1];
				if(x !== 0 || y !== 0) {
					changed = true;
					this.a.x += x;
					this.b.x += x;
					this.a.y += y;
					this.b.y += y;
				}
				break;	
			default:
				//TODO error
		}
		
		if(changed) {
			this._changed();
		}
	},
	
	/***
	 * Includes the bounds b into the current bounds.
	 * @param {Bounds} b
	 */
	include: function(b) {
		
		if( (this.a.x === undefined) && (this.a.y === undefined) &&
			(this.b.x === undefined) && (this.b.y === undefined)) {
			return b;
		};
		
		var c = {
			x: Math.min(
				Math.min(this.a.x, this.b.x),
				Math.min(b.a.x, b.b.x)
			),
			y: Math.min(
				Math.min(this.a.y, this.b.y),
				Math.min(b.a.y, b.b.y)
		)};
		
		var d = {
			x: Math.max(
				Math.max(this.a.x, this.b.x),
				Math.max(b.a.x, b.b.x)
			),
			y: Math.max(
				Math.max(this.a.y, this.b.y),
				Math.max(b.a.y, b.b.y)
		)};
		
		if(this.a.x !== c.x || this.a.y !== c.y || this.b.x !== d.x || this.b.y !== d.y) {
			this.a = c;
			this.b = d;
			
			this._changed();
		}
	},
	
	/**
	 * Relatively extends the bounds by p.
	 * @param {Point} p
	 */
	extend: function(p) {
		
		if(p.x !== 0 || p.y !== 0) {
			// this is over cross for the case that a and b have same coordinates.
			((this.a.x > this.b.x) ? this.a : this.b).x += p.x;
			((this.b.y > this.a.y) ? this.b : this.a).y += p.y;
			
			this._changed();
		}
	},
	
	/**
	 * Widens the scope of the bounds by x.
	 * @param {Number} x
	 */
	widen: function(x) {
		if (x !== 0) {
			this.moveBy({x: -x, y: -x});
			this.extend({x: 2*x, y: 2*x});
		}
	},
	
	/**
	 * Returns the upper left corner's point regardless of the
	 * bound delimiter points.
	 */
	upperLeft: function() {
		
		return {
			x: Math.min(this.a.x, this.b.x),
			y: Math.min(this.a.y, this.b.y)
		};
	},
	
	/**
	 * Returns the lower Right left corner's point regardless of the
	 * bound delimiter points.
	 */
	lowerRight: function() {
		
		return {
			x: Math.max(this.a.x, this.b.x),
			y: Math.max(this.a.y, this.b.y)
		};
	},
	
	/**
	 * @return {Number} Width of bounds.
	 */
	width: function() {
		return Math.abs(this.a.x - this.b.x);
	},
	
	/**
	 * @return {Number} Height of bounds.
	 */
	height: function() {
		return Math.abs(this.a.y - this.b.y);
	},
	
	/**
	 * @return {Point} The center point of this bounds.
	 */
	center: function() {
		return {
			x: (this.a.x + this.b.x)/2.0, 
			y: (this.a.y + this.b.y)/2.0
		};
	},
	
	/**
	 * Moves the center point of this bounds to the new position.
	 * @param p {Point} 
	 * or
	 * @param x {Number}
	 * @param y {Number}
	 */
	centerMoveTo: function() {
		var currentPosition = this.center();
		
		switch (arguments.length) {
			
			case 1:
				this.moveBy({
							x: arguments[0].x - currentPosition.x,
							y: arguments[0].y - currentPosition.y
				});
				break;
			
			case 2:
				this.moveBy({
					x: arguments[0] - currentPosition.x,
					y: arguments[1] - currentPosition.y
				});
				break;
		}
	},
	
	isIncluded: function(point) {
		
		var ul = this.upperLeft();
		var lr = this.lowerRight();
		
		if(point.x >= ul.x && point.x <= lr.x && point.y >= ul.y && point.y <= lr.y)
			return true;
		else 
			return false;
	},
	
	/**
	 * @return {Bounds} A copy of this bounds.
	 */
	clone: function() {
		
		//Returns a new bounds object without the callback
		// references of the original bounds
		return new ORYX.Core.Bounds(this);
	},
	
	toString: function() {
		
		return "( "+this.a.x+" | "+this.a.y+" )/( "+this.b.x+" | "+this.b.y+" )";
	},
	
	serializeForERDF: function() {

		return this.a.x+","+this.a.y+","+this.b.x+","+this.b.y;
	}
 });