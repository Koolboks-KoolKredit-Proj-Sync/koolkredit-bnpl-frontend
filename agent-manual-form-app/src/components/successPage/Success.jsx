// import { CheckCircle } from "lucide-react";
// import { useLocation } from "react-router-dom";

// export default function BnplApproved() {
//   const { state } = useLocation();
//   const customer = state?.customer;

//   if (!customer) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#f7623b]">
//         <div className="bg-black text-white p-6 rounded-lg">
//           Invalid or expired session
//         </div>
//       </div>
//     );
//   }

//   const pronoun =
//     customer.gender === "Male"
//       ? "his"
//       : customer.gender === "Female"
//       ? "her"
//       : "their";


// import { useEffect, useState } from "react";
// import { CheckCircle } from "lucide-react";

// export default function BnplApproved() {
//   // Extract ref from URL query parameters manually
//   const urlParams = new URLSearchParams(window.location.search);
//   const ref = urlParams.get("ref");
  
//   const [customer, setCustomer] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!ref) {
//       console.error("No reference ID found in URL");
//       return;
//     }
  
//     fetch(`http://localhost:8080/api/application/success/${ref}`)
//       .then(res => {
//         if (!res.ok) throw new Error("Server response was not ok");
//         return res.json();
//       })
//       .then(data => {
//         if (data && data.customer) {
//           setCustomer(data.customer);
//         } else {
//           console.error("Data received but customer object missing", data);
//         }
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error("Fetch error:", err);
//         setLoading(false);
//       });
//   }, [ref]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#f7623b" }}>
//         <div className="text-white text-xl">Loading...</div>
//       </div>
//     );
//   }

//   if (!customer || !ref) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#f7623b" }}>
//         <div className="bg-black p-10 rounded-xl text-center">
//           <p className="text-white text-xl">Invalid or expired session</p>
//         </div>
//       </div>
//     );
//   }

//   const pronoun =
//     customer.gender === "Male"
//       ? "his"
//       : customer.gender === "Female"
//       ? "her"
//       : "their";

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#f7623b" }}>
//       <div className="bg-black p-10 rounded-xl text-center max-w-md">
//         <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
//         <h1 className="text-2xl text-[#f7623b] font-bold">
//           Application Approved 🎉
//         </h1>
//         <p className="text-gray-300 mt-4">
//           Dear <span className="text-white font-semibold">{customer.firstName}</span>,
//           your BNPL application has been approved.
//         </p>
//         <p className="text-gray-400 mt-2">
//           Please check <span className="text-white font-semibold">{pronoun}</span> email
//           for payment instructions.
//         </p>
//       </div>
//     </div>
//   );
// }





import { useEffect, useState } from "react";
import { CheckCircle, Sparkles, Gift, Trophy } from "lucide-react";

export default function BnplApproved() {
  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get("ref");
  
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Generate random values once on mount
  const [fireworksData] = useState(() => 
    [...Array(20)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      color: ['#ffd700', '#ff69b4', '#00ff00', '#00bfff', '#ff4500'][Math.floor(Math.random() * 5)],
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 200,
      delay: Math.random() * 2,
      duration: 1 + Math.random()
    }))
  );
  
  const [confettiData] = useState(() =>
    [...Array(50)].map(() => ({
      left: Math.random() * 100,
      top: -(Math.random() * 20),
      color: ['#ffd700', '#ff69b4', '#00ff00', '#00bfff', '#ff4500', '#9d4edd'][Math.floor(Math.random() * 6)],
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 2,
      isCircle: Math.random() > 0.5
    }))
  );

  useEffect(() => {
    if (!ref) {
      console.error("No reference ID found in URL");
      return;
    }
  
    fetch(`https://koolkredit-bnpl-backend-gqbj.onrender.com/api/application/success/${ref}`)
      .then(res => {
        if (!res.ok) throw new Error("Server response was not ok");
        return res.json();
      })
      .then(data => {
        if (data && data.customer) {
          setCustomer(data.customer);
        } else {
          console.error("Data received but customer object missing", data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [ref]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#f7623b" }}>
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!customer || !ref) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#f7623b" }}>
        <div className="bg-black p-10 rounded-xl text-center">
          <p className="text-white text-xl">Invalid or expired session</p>
        </div>
      </div>
    );
  }

//   const pronoun =
//     customer.gender === "Male"
//       ? "his"
//       : customer.gender === "Female"
//       ? "her"
//       : "their";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative" style={{ backgroundColor: "#f7623b" }}>
      {/* Fireworks Effect */}
      <style>{`
        @keyframes firework {
          0% { transform: translate(0, 0) scale(0); opacity: 1; }
          50% { opacity: 1; }
          100% { transform: translate(var(--x), var(--y)) scale(1); opacity: 0; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes confetti-fall {
          0% { transform: translateY(-100vh) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(360deg); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.5); }
          50% { box-shadow: 0 0 40px rgba(34, 197, 94, 0.8); }
        }
        
        .firework {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          animation: firework 1s ease-out infinite;
        }
        
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          animation: confetti-fall linear infinite;
        }
        
        .float-icon {
          animation: float 3s ease-in-out infinite;
        }
        
        .sparkle-icon {
          animation: sparkle 2s ease-in-out infinite;
        }
        
        .success-card {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Fireworks Container */}
      <div className="absolute inset-0 pointer-events-none">
        {fireworksData.map((fw, i) => (
          <div
            key={i}
            className="firework"
            style={{
              left: `${fw.left}%`,
              top: `${fw.top}%`,
              backgroundColor: fw.color,
              '--x': `${fw.x}px`,
              '--y': `${fw.y}px`,
              animationDelay: `${fw.delay}s`,
              animationDuration: `${fw.duration}s`
            }}
          />
        ))}
      </div>

      {/* Confetti */}
      <div className="absolute inset-0 pointer-events-none">
        {confettiData.map((conf, i) => (
          <div
            key={i}
            className="confetti"
            style={{
              left: `${conf.left}%`,
              top: `${conf.top}%`,
              backgroundColor: conf.color,
              animationDuration: `${conf.duration}s`,
              animationDelay: `${conf.delay}s`,
              opacity: 0.7,
              borderRadius: conf.isCircle ? '50%' : '0'
            }}
          />
        ))}
      </div>

      {/* Floating Icons */}
      <Sparkles className="absolute top-20 left-10 w-8 h-8 text-yellow-300 float-icon" style={{ animationDelay: '0s' }} />
      <Gift className="absolute top-32 right-16 w-10 h-10 text-pink-400 float-icon" style={{ animationDelay: '0.5s' }} />
      <Trophy className="absolute bottom-24 left-20 w-12 h-12 text-yellow-400 float-icon" style={{ animationDelay: '1s' }} />
      <Sparkles className="absolute bottom-40 right-24 w-6 h-6 text-green-300 sparkle-icon" style={{ animationDelay: '0.3s' }} />
      <Sparkles className="absolute top-1/3 right-10 w-8 h-8 text-blue-300 sparkle-icon" style={{ animationDelay: '1.5s' }} />

      {/* Main Content Card */}
      <div className="bg-black p-12 rounded-2xl text-center max-w-lg relative z-10 success-card border-2 border-green-500">
        {/* Success Icon with Glow */}
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto relative" />
        </div>

        {/* Celebration Badge */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 rounded-full mb-4">
          <Trophy className="w-5 h-5 text-white" />
          <span className="text-white font-bold text-sm">APPROVED!</span>
          <Trophy className="w-5 h-5 text-white" />
        </div>

        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#f7623b] via-orange-400 to-yellow-400 bg-clip-text text-transparent">
          Congratulations!
        </h1>
        
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles className="w-6 h-6 text-yellow-400" />
          <h2 className="text-xl text-[#f7623b] font-semibold">
            Application Approved
          </h2>
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </div>

        <div className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-800">
          <p className="text-gray-300 text-lg mb-2">
            Dear <span className="text-white font-bold text-xl">{customer.firstName}</span>,
          </p>
          <p className="text-gray-400">
            Your BNPL application has been successfully approved! 🎊
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-900 to-green-950 rounded-lg p-5 border border-green-500">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Gift className="w-5 h-5 text-green-400" />
            <p className="text-green-300 font-semibold">Next Steps</p>
          </div>
          <p className="text-gray-300 text-sm">
            Please check <span className="text-white font-semibold">Your</span> email inbox for detailed payment instructions and next steps.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full blur-sm opacity-70"></div>
        <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-pink-400 rounded-full blur-sm opacity-70"></div>
        <div className="absolute top-1/2 -left-6 w-6 h-6 bg-green-400 rounded-full blur-sm opacity-70"></div>
        <div className="absolute top-1/4 -right-6 w-6 h-6 bg-blue-400 rounded-full blur-sm opacity-70"></div>
      </div>
    </div>
  );
}
