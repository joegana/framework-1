const { describe, it } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import WidgetBase from '../../../../src/widget-core/WidgetBase';
import { watch } from '../../../../src/widget-core/decorators/watch';
import { VNode } from '../../../../src/widget-core/interfaces';

describe('Watch', () => {
	it('should invalidate on set', () => {
		let invalidateCount = 0;
		class A extends WidgetBase {
			@watch() private _a: string;

			invalidate() {
				invalidateCount++;
			}

			render() {
				this._a = 'other';
				return this._a;
			}
		}

		const widget = new A();
		const result = widget.__render__() as VNode;
		assert.strictEqual(result.text, 'other');
		assert.strictEqual(invalidateCount, 1);
	});
});
