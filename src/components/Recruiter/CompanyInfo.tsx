type CompanyInfoProps = {
  companyName: string;
  description: string;
  industry: string;
  size: string;
  address: string;
  website?: string;
};

const CompanyInfo = ({
  companyName,
  description,
  industry,
  size,
  address,
  website,
}: CompanyInfoProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-3">
      <h2 className="text-xl font-bold text-teal-700">{companyName}</h2>
      <p className="text-gray-700">{description}</p>
      <div className="text-sm text-gray-600 space-y-1">
        <p>
          <strong>Ngành nghề:</strong> {industry}
        </p>
        <p>
          <strong>Quy mô:</strong> {size}
        </p>
        <p>
          <strong>Địa chỉ:</strong> {address}
        </p>
        {website && (
          <p>
            <strong>Website:</strong>{" "}
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 underline"
            >
              {website}
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default CompanyInfo;
