---
# TEST FIXTURE — not content, not a draft translation, never published.
# It exists so ci-obligations.md §4 has a translated-article route to assert
# against (content-model.md §5). web/tests/install-fixtures.ts copies it into
# src/content/translations/ for the e2e build and deletes it afterwards; the
# copy is gitignored and dockerignored. The Hebrew below is synthetic prose
# written to exercise RTL rendering — it is not awaiting Tal's review and must
# not be mistaken for one. `original` points at example.com by design.
title: 'שכבת המטמון שאף אחד לא מסתכל עליה'
description: 'למה כותרת אחת בתשובת HTTP קובעת יותר מכל אופטימיזציה שתכתבו בקוד.'
pubDate: 2026-08-06
tags: ['http', 'ביצועים']
original:
  title: 'The Cache Layer Nobody Looks At'
  author: 'A. Fixture'
  url: 'https://example.com/articles/the-cache-layer-nobody-looks-at'
  publishedAt: 2019-04-11
rights:
  basis: 'direct-permission'
  consultedAt: 2026-08-06
---

הדבר הראשון שאני בודק כשאתר איטי הוא לא הקוד. הוא התשובה עצמה — מה השרת
אמר לדפדפן, ומה הדפדפן הבין מזה. ברוב המקרים התשובה הזאת נכתבה פעם אחת,
לפני שנתיים, ואף אחד לא חזר אליה מאז.

## מה הדפדפן באמת שומר

דפדפן לא שומר קבצים כי הם קטנים או כי הם נראים סטטיים. הוא שומר מה
שאמרו לו לשמור, ולכמה זמן. הכלל פשוט: בלי הוראה מפורשת, הדפדפן מנחש —
וניחוש הוא בדיוק מה שאתם לא רוצים בשכבה שאמורה להיות צפויה.

שלוש שאלות מספיקות כדי לתאר כל משאב באתר:

- כמה זמן התשובה תקפה
- מי רשאי לשמור אותה — הדפדפן בלבד, או גם שרתי ביניים
- מה קורה כשהיא פגה

## הכותרת שקובעת הכול

הנה התשובה שאני רוצה לראות עבור נכס עם חתימה בשם הקובץ. שימו לב שהיא
נקראת משמאל לימין, כמו כל קוד, גם בתוך עמוד שנקרא מימין לשמאל:

```http
HTTP/1.1 200 OK
Content-Type: text/css; charset=utf-8
Cache-Control: public, max-age=31536000, immutable
ETag: "a4f1c9"
```

`max-age=31536000` הוא שנה בשניות. `immutable` אומר לדפדפן לא לטרוח
בבדיקה חוזרת גם כשהמשתמש מרענן. שתי המילים האלה יחד שוות יותר מכל
מיני-פיקציה שתריצו על אותו קובץ.

עבור HTML, לעומת זאת, אני רוצה בדיוק את ההפך: אפס אחסון, ובדיקה בכל
טעינה. דף שנשמר לשנה הוא דף שלא תוכלו לתקן.

## איפה זה נשבר בפועל

הכשל הנפוץ ביותר הוא נכס בלי חתימה בשם הקובץ שקיבל `max-age` ארוך.
הקובץ מתעדכן, השם נשאר, והמשתמש ממשיך לראות את הגרסה הישנה עד שהוא
מנקה את האחסון בעצמו — כלומר לעולם. החתימה בשם היא מה שהופך תאריך
תפוגה ארוך מסיכון להחלטה.

השני בתדירותו הוא `Vary` שנשכח. תשובה שמשתנה לפי `Accept-Encoding`
ולא מצהירה על כך תגיע דחוסה ללקוח שלא ביקש דחיסה, וזה נראה כמו באג
בקוד שלכם במשך שבוע.

## מה לעשות מחר בבוקר

פתחו את לשונית הרשת, טענו את הדף פעמיים, והסתכלו על העמודה שאומרת מאיפה
הגיעה כל תשובה. כל שורה שהגיעה מהרשת בטעינה השנייה היא שאלה פתוחה. אצלי
באתר — T://bendet — הרשימה הזאת קצרה בכוונה, ולקח בערך 20 דקות להביא
אותה לשם.

זה לא אופטימיזציה מתוחכמת. זו הצהרה אחת, נכונה, במקום הנכון.
