import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import Base64Decode from "@/components/actions/Base64Decode.vue";
import { typedArraysAreEqual } from "../helpers";

describe("Base64Decode.vue", () => {
  it("decodes input correctly", () => {
    const inputString = "aGVsbG8gd29ybGQg8J+mhA==";
    const outputString =
      "104,101,108,108,111,32,119,111,114,108,100,32,240,159,166,132";
    const result = Uint8Array.from(outputString.split(","));
    const wrapper = shallowMount(Base64Decode, {
      propsData: {
        inputString,
        inputFile: {},
        useFile: false
      }
    });

    expect(typedArraysAreEqual(result, wrapper.vm.intArray)).to.equal(true);
  });
});
