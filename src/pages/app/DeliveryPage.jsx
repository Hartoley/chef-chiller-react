import { useState } from "react";
import { toast } from "react-toastify";
import { Field, PageTitle } from "../../components/ui";
import { deliveryAreas } from "../../data/showcase";
import { useCustomer } from "./CustomerContext";

const key = (id) => `ata.delivery.${id}`;

function load(id) {
  try {
    return JSON.parse(localStorage.getItem(key(id))) || {};
  } catch {
    return {};
  }
}

export default function DeliveryPage() {
  const { userId, user } = useCustomer();
  const saved = load(userId);
  const [area, setArea] = useState(saved.area || "");
  const [address, setAddress] = useState(saved.address || "");
  const [phone, setPhone] = useState(saved.phone || "");

  const save = (e) => {
    e.preventDefault();
    if (!area) return toast.error("Choose your area");
    try {
      localStorage.setItem(key(userId), JSON.stringify({ area, address, phone }));
      toast.success("Delivery details saved");
    } catch {
      toast.error("Your browser blocked saving. Try again outside private mode.");
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <PageTitle title="Delivery details">Tell our rider where to find you.</PageTitle>
      <form onSubmit={save} className="space-y-5 rounded-3xl bg-white p-6 ring-1 ring-line">
        <Field label="Area" id="area">
          <select id="area" value={area} onChange={(e) => setArea(e.target.value)} className="field">
            <option value="">Choose your area</option>
            {deliveryAreas.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </Field>
        <Field
          label="Street address and landmark"
          name="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="e.g. 12 Awolowo Avenue, opposite the filling station"
        />
        <Field
          label="Phone number for this delivery"
          name="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={user?.phoneNumber || "0803 000 0000"}
          hint="Leave empty to use the number on your account."
        />
        <button type="submit" className="btn-primary w-full py-3">
          Save details
        </button>
        <p className="text-center text-sm text-ink-faint">Saved on this device.</p>
      </form>
    </div>
  );
}
