const { assert } = intern.getPlugin('chai');
const { describe, it } = intern.getInterface('bdd');
import * as sinon from 'sinon';
import NodeHandler from '../../../../src/widget-core/NodeHandler';
import WidgetBase from '../../../../src/widget-core/WidgetBase';
import Build from '../../../../src/widget-core/meta/Build';

let bindInstance = new WidgetBase();

describe('Build Meta', () => {
	it('Should resolve module result when async', () => {
		let resolverOne: any;
		let resolverTwo: any;
		const promiseOne = new Promise((resolve) => {
			resolverOne = resolve;
		});
		const promiseTwo = new Promise((resolve) => {
			resolverTwo = resolve;
		});

		const invalidate = sinon.stub();
		const nodeHandler = new NodeHandler();

		function testModule(a: string): string | null {
			return promiseOne as any;
		}

		function testModuleOther(a: string): string | null {
			return promiseTwo as any;
		}

		const meta = new Build({
			invalidate,
			nodeHandler,
			bind: bindInstance
		});

		const resultOne = meta.run(testModule)('test');
		const resultTwo = meta.run(testModuleOther)('test');
		assert.isNull(resultOne);
		assert.isNull(resultTwo);

		resolverOne('resultOne');
		resolverTwo('resultTwo');

		return Promise.all([promiseOne, promiseTwo]).then(() => {
			const resultOne = meta.run(testModule)('test');
			assert.strictEqual(resultOne, 'resultOne');
			const resultTwo = meta.run(testModuleOther)('test');
			assert.strictEqual(resultTwo, 'resultTwo');
		});
	});

	it('Should return the result immediately when sync', () => {
		const invalidate = sinon.stub();
		const nodeHandler = new NodeHandler();

		function testModule(a: string): string | null {
			return 'sync';
		}

		const meta = new Build({
			invalidate,
			nodeHandler,
			bind: bindInstance
		});

		const resultOne = meta.run(testModule)('test');
		assert.strictEqual(resultOne, 'sync');
	});
});
