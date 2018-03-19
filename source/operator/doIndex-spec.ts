/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-etc
 */
/*tslint:disable:no-unused-expression*/

import { expect } from "chai";
import { from } from "rxjs/observable/from";
import { marbles } from "rxjs-marbles";
import { doIndex } from "./doIndex";

describe("operator/doIndex", () => {

    it("should mirror multiple values and complete", marbles((m) => {

        const source =   m.cold("--1--2--3--|");
        const subs =            "^----------!";
        const expected = m.cold("--1--2--3--|");

        const destination = doIndex.call(source, () => {});
        m.expect(destination).toBeObservable(expected);
        m.expect(source).toHaveSubscriptions(subs);
    }));

    it("should mirror multiple values and terminate with error", marbles((m) => {

        const source =   m.cold("--1--2--3--#");
        const subs =            "^----------!";
        const expected = m.cold("--1--2--3--#");

        const destination = doIndex.call(source, () => {});
        m.expect(destination).toBeObservable(expected);
        m.expect(source).toHaveSubscriptions(subs);
    }));

    it("should pass the index", () => {

        let seen: any[] = [];

        doIndex.call(
            from(["alice", "bob"]),
            (value: string, index: number) => seen.push({ index, value })
        ).subscribe();

        expect(seen).to.deep.equal([{
            index: 0,
            value: "alice"
        }, {
            index: 1,
            value: "bob"
        }]);
    });

    it("should reset the index for each subscription", () => {

        let seen: any[] = [];

        let observable = doIndex.call(
            from(["alice", "bob"]),
            (value: string, index: number) => seen.push({ index, value })
        );

        observable.subscribe();
        observable.subscribe();

        expect(seen).to.deep.equal([{
            index: 0,
            value: "alice"
        }, {
            index: 1,
            value: "bob"
        }, {
            index: 0,
            value: "alice"
        }, {
            index: 1,
            value: "bob"
        }]);
    });
});