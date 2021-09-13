import decode from "./index";

// https://zxing.org/w/decode?u=https%3A%2F%2Fgithub.com%2Fobrassard%2Fshc-extractor%2Fraw%2Fmain%2Fsample%2Fsample-qr-code.png
const rawQrText =
  "shc:/567629095243206034602924374044603122295953265460346029254077280433602870286471674522280928613331456437653141590640220306450459085643550341424541364037063665417137241236380304375622046737407532323925433443326057360106452931531270742428395038692212766566046938775507593966070420405229673107363333693803425720586229543633123300103877712022113608123739554159750065216576244136280332243607756009665859260023605803272728675721123035212164252561302458076644543210260735435742003171574339537172115043532966334536735428113958605523117307120954595940355931687040114532417303424039651066632209425741412212703267325456534137225708120573042126716936576331122727086139744341560859437500341264706904260465583253732838100829123422126208775858655545243477645920507637325929080373682704763707057100412927585265582550667760036577704021621136444536642771754403736036776160662638060600324033352612760522074054305466502054376441420410096741425206682467446356124533125330537750124227303028400359750054286111584333366267631155530460382155690074592636502724332654657410557730225306356323745403423657422565211128283333346832702663720538744360722833654566035731067308726224373476706465293608106711742940525720295456606873533426066835102443280923746156754126314130556412726961056137220606047644413737522667302267377250590432617356226443096866703304680076745369120674030573312336127454012437565572373107004250255426335362717057650427082543112329402404675520202939260458387410313866226959567029050800693059723470237666045873346268737738504572586731601071064358";

test("decode invalid protocol (invalid url)", async () => {
  expect.assertions(1);
  try {
    await decode("");
  } catch (err) {
    expect(err).toMatchObject({
      message: "Expected shc protocol but received ",
    });
  }
});

test("decode invalid protocol", async () => {
  expect.assertions(1);
  try {
    await decode("http://google.com");
  } catch (err) {
    expect(err).toMatchObject({
      message: "Expected shc protocol but received http",
    });
  }
});

test("decode", async () => {
  expect(await decode(rawQrText)).toMatchInlineSnapshot(`
Object {
  "header": Object {
    "alg": "ES256",
    "kid": "3Kfdg-XwP-7gXyywtUfUADwBumDOPKMQx-iELL11W9s",
    "zip": "DEF",
  },
  "payload": Object {
    "iss": "https://smarthealth.cards/examples/issuer",
    "nbf": 1620847989.837,
    "vc": Object {
      "credentialSubject": Object {
        "fhirBundle": Object {
          "entry": Array [
            Object {
              "fullUrl": "resource:0",
              "resource": Object {
                "birthDate": "1951-01-20",
                "name": Array [
                  Object {
                    "family": "Anyperson",
                    "given": Array [
                      "John",
                      "B.",
                    ],
                  },
                ],
                "resourceType": "Patient",
              },
            },
            Object {
              "fullUrl": "resource:1",
              "resource": Object {
                "lotNumber": "0000001",
                "occurrenceDateTime": "2021-01-01",
                "patient": Object {
                  "reference": "resource:0",
                },
                "performer": Array [
                  Object {
                    "actor": Object {
                      "display": "ABC General Hospital",
                    },
                  },
                ],
                "resourceType": "Immunization",
                "status": "completed",
                "vaccineCode": Object {
                  "coding": Array [
                    Object {
                      "code": "207",
                      "system": "http://hl7.org/fhir/sid/cvx",
                    },
                  ],
                },
              },
            },
            Object {
              "fullUrl": "resource:2",
              "resource": Object {
                "lotNumber": "0000007",
                "occurrenceDateTime": "2021-01-29",
                "patient": Object {
                  "reference": "resource:0",
                },
                "performer": Array [
                  Object {
                    "actor": Object {
                      "display": "ABC General Hospital",
                    },
                  },
                ],
                "resourceType": "Immunization",
                "status": "completed",
                "vaccineCode": Object {
                  "coding": Array [
                    Object {
                      "code": "207",
                      "system": "http://hl7.org/fhir/sid/cvx",
                    },
                  ],
                },
              },
            },
          ],
          "resourceType": "Bundle",
          "type": "collection",
        },
        "fhirVersion": "4.0.1",
      },
      "type": Array [
        "https://smarthealth.cards#health-card",
        "https://smarthealth.cards#immunization",
        "https://smarthealth.cards#covid19",
      ],
    },
  },
  "verifications": Object {
    "origin": "https://smarthealth.cards/examples/issuer",
    "trustable": true,
    "verifiedBy": "3Kfdg-XwP-7gXyywtUfUADwBumDOPKMQx-iELL11W9s",
  },
}
`);
});
