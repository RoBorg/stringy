import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import Base64Decode from "@/components/actions/Base64Decode.vue";

describe("Base64Decode.vue", () => {
  it("decodes input correctly", done => {
    const inputString = "aGVsbG8gd29ybGQg8J+mhA==";
    const result =
      "104,101,108,108,111,32,119,111,114,108,100,32,240,159,166,132";
    const wrapper = shallowMount(Base64Decode, {
      propsData: {
        inputString,
        inputFile: {},
        useFile: false
      }
    });

    setTimeout(() => {
      const intArray = wrapper.get("output-stub").attributes("intarray");
      expect(intArray).to.equal(result);
      done();
    }, 10);
  });
});
