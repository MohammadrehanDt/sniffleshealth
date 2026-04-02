import { useWatch } from "react-hook-form";

export const SOAPPreview = () => {
  const data = useWatch();

  const Row = ({
    label,
    value,
  }: {
    label: string;
    value?: string | number | null;
  }) => (
    <div className="flex justify-between py-0.5 text-[11px]">
      <span className="text-[#1B2B2E] text-sm font-normal">{label}</span>
      <span className="text-[#4A5E63] font-normal text-sm text-right max-w-[160px]">
        {value || "---"}
      </span>
    </div>
  );

  const symptoms = data.symptoms || [];
  const medicalHistory = data.medicalHistory || [];
  const surgicalHistory = data.surgicalHistory || [];
  const allergies = data.allergies || [];

  return (
    <div className="bg-white border border-[#D7E1E4] rounded p-10  space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-800">
          AI SOAP Note - Live Generation
        </h3>
        <p className="text-xs text-slate-400">
          We'll match you with a licensed physician in your state.
        </p>
      </div>

      {/* SUBJECTIVE */}
      <div className="border border-[#D7E1E4] bg-slate-50/20 rounded p-5">
        <h4 className="text-sm font-medium text-[#146D75] uppercase tracking-widest mb-4 border-b border-teal-100 pb-1">
          Subjective
        </h4>
        <div className="space-y-0.5">
          <Row label="Location" value={data.state} />
          <Row label="First Name" value={data.firstName} />
          <Row label="Last Name" value={data.lastName} />
          <Row label="DOB" value={data.dob} />
          <Row label="Gender" value={data.gender} />
          <Row
            label="Chief Complaint"
            value={symptoms.length > 0 ? symptoms.join(", ") : undefined}
          />
          {data.manualSymptom && (
            <Row label="Others Complaint" value={data.manualSymptom} />
          )}
          <Row label="Duration" value={data.duration} />
          <Row
            label="Severity"
            value={data.severity ? `${data.severity}/10` : undefined}
          />
          {data.fever && data.fever !== 98.6 && (
            <Row label="Fever" value={String(data.fever)} />
          )}
          {data.coughType && <Row label="Cough" value={data.coughType} />}
          {data.sputumColor && <Row label="Sputum" value={data.sputumColor} />}
          {medicalHistory.length > 0 && (
            <Row label="PMH" value={medicalHistory.join(", ")} />
          )}
          {surgicalHistory.length > 0 ? (
            <Row label="PSH" value={surgicalHistory.join(", ")} />
          ) : (
            medicalHistory.length > 0 && <Row label="PSH" value="Nothing" />
          )}
          {allergies.length > 0 ? (
            <Row label="Allergies" value={allergies.join(", ")} />
          ) : (
            surgicalHistory.length > 0 && (
              <Row label="Allergies" value="Nothing" />
            )
          )}
          <Row
            label="Medications"
            value={
              data.medications || (allergies.length > 0 ? "Nothing" : undefined)
            }
          />
          {(data.smoking || data.alcohol) && (
            <Row
              label="Social"
              value={[
                data.smoking ? `Smoking ${data.smoking}` : null,
                data.alcohol ? `Alcohol ${data.alcohol}` : null,
              ]
                .filter(Boolean)
                .join(", ")}
            />
          )}
        </div>
      </div>

      {/* OBJECTIVE - Show from Step 4 onwards */}
      {(data.bpSystolic ||
        data.bpDiastolic ||
        data.heartRate ||
        data.readingLocation) && (
        <div className="border border-slate-100 rounded-2xl p-5">
          <h4 className="text-sm font-medium text-[#146D75] uppercase tracking-widest mb-4 border-b border-teal-100 pb-1">
            Objective
          </h4>
          <div className="space-y-0.5">
            <Row label="General" value="Alert, oriented, no acute distress" />
            <Row label="Blood Pressure (Systolic)" value={data.bpSystolic} />
            <Row label="Blood Pressure (Diastolic)" value={data.bpDiastolic} />
            {data.readingLocation && (
              <Row label="Reading at" value={data.readingLocation} />
            )}
            <Row
              label="Heart Rate"
              value={data.heartRate ? `${data.heartRate}bpm` : undefined}
            />
            <Row
              label="Fever"
              value={data.fever ? String(data.fever) : undefined}
            />
          </div>
        </div>
      )}

      {/* ASSESSMENT & PLAN - Show from Step 7 onwards */}
      {symptoms.length > 0 &&
        (medicalHistory.length > 0 || allergies.length > 0) && (
          <div className="space-y-4">
            <div className="border border-slate-100 rounded p-5">
              <h4 className="text-sm font-medium text-[#146D75] uppercase tracking-widest mb-4 border-b border-teal-100 pb-1">
                Assessment
              </h4>
              <p className="text-[14px] font-mono text-[#1B2B2E]">
                1. Upper respiratory infection
              </p>
            </div>
            <div className="border border-slate-100 rounded p-5">
              <h4 className="text-sm font-medium text-[#146D75] uppercase tracking-widest mb-4 border-b border-teal-100 pb-1">
                Plan
              </h4>
              <p className="text-[14px] font-mono text-[#1B2B2E]">
                • Physician review pending
              </p>
              <p className="text-[14px] font-mono text-[#1B2B2E]">
                • Treatment plan to be determined after consultation
              </p>
            </div>
          </div>
        )}
    </div>
  );
};
