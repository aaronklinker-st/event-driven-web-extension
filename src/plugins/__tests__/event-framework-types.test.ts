import { ExpandPattern, SimplifyPattern } from "../event-framework/framework";
import {} from "../event-framework/framework";

// Simplify Pattern
{
  // Prefix
  const p1: SimplifyPattern<"*.a"> = "*.a";
  const p2: SimplifyPattern<"*.*.a"> = "*.a";
  const p3: SimplifyPattern<"*.*.*.a"> = "*.a";
  // Suffix
  const s1: SimplifyPattern<"a.*"> = "a.*";
  const s2: SimplifyPattern<"a.*.*"> = "a.*";
  const s3: SimplifyPattern<"a.*.*.*"> = "a.*";
  // Both
  const b1: SimplifyPattern<"*.a.*"> = "*.a.*";
  const b2: SimplifyPattern<"*.a.*.*"> = "*.a.*";
  const b3: SimplifyPattern<"*.*.a.*"> = "*.a.*";
  const b4: SimplifyPattern<"*.*.a.*.*"> = "*.a.*";
  // Middle
  const m1: SimplifyPattern<"a.*.b"> = "a.*.b";
  const m2: SimplifyPattern<"a.*.*.b"> = "a.*.b";
  const m3: SimplifyPattern<"a.*.*.*.b"> = "a.*.b";

  // Multiple middles
  const mm1: SimplifyPattern<"a.*.*.b.*.*.c"> = "a.*.b.*.c";
  const mm2: SimplifyPattern<"a.*.*.b.*.*.c.*.*.*.d"> = "a.*.b.*.c.*.d";
}

// Expand Pattern
{
  // No periods
  const e2: ExpandPattern<"a"> = "a";

  // One period
  const o1: ExpandPattern<"a.b"> = "a.b";
  const o2: ExpandPattern<"a.b"> = "a.*";
  const o3: ExpandPattern<"a.b"> = "*.b";
  const o4: ExpandPattern<"a.b"> = "*";
  // @ts-expect-error
  const o5: ExpandPattern<"a.b"> = "*.*";

  // Two periods
  const t1: ExpandPattern<"a.b.c"> = "a.b.c";
  const t2: ExpandPattern<"a.b.c"> = "a.b.*";
  const t3: ExpandPattern<"a.b.c"> = "a.*.c";
  const t4: ExpandPattern<"a.b.c"> = "*.b.c";
  const t6: ExpandPattern<"a.b.c"> = "a.*";
  const t5: ExpandPattern<"a.b.c"> = "*.b.*";
  const t7: ExpandPattern<"a.b.c"> = "*.c";
  const t8: ExpandPattern<"a.b.c"> = "*";
  // @ts-expect-error
  const t9: ExpandPattern<"a.b.c"> = "*.*";
  // @ts-expect-error
  const t10: ExpandPattern<"a.b.c"> = "*.*.*";
  // @ts-expect-error
  const t11: ExpandPattern<"a.b.c"> = "a.*.*";
  // @ts-expect-error
  const t12: ExpandPattern<"a.b.c"> = "*.*.c";

  // Three periods
  const th1: ExpandPattern<"a.b.c.d"> = "a.b.c.d";
  const th2: ExpandPattern<"a.b.c.d"> = "a.*.d";
  // @ts-expect-error
  const th3: ExpandPattern<"a.b.c.d"> = "a.*.*.d";
}
